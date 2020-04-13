import _ from "lodash";
import { ROOT_LANGUAGE } from "../constants.mjs";

const WORDS_IN_COMMON_THRESHOLD = 1;
const VOLUME_DELTA_PERCENT_TOLERANCE = 0.1;

const stats = {
  perfectMatches: 0,
  noSameYearSameCountry: [],
  titleComparisonExceedThreshold: [],
  titleComparisonFailedThreshold: []
};

const customDictionary = {
  aids: "sida",
  bavaria: "baviere",
  bundesrat: "bundeslander",
  european: "europeenne",
  farming: "agriculture",
  presidency: "presidence",
  solidarity: "solidarite"
};

const customTranslator = word => customDictionary[word] || word;

export const formatID = (country, year, orderNumber) => {
  const twoDigitOrder = ("0" + orderNumber).slice(-2);

  return `${country}-${year}-${twoDigitOrder}`;
};

export const coinsWithSameCountryAndYear = (
  coins,
  countrySearched,
  yearSearched
) =>
  coins.filter(
    ({ country, date }) =>
      country === countrySearched && date.getFullYear() === yearSearched
  );

export const coinsWithAboutSameVolume = (coins, volumeDesired) =>
  coins.filter(
    ({ volume }) =>
      Math.abs(volume - volumeDesired) <=
      VOLUME_DELTA_PERCENT_TOLERANCE * volumeDesired
  );

const orderByDateAndTitle = lang => (a, b) =>
  a.date - b.date !== 0
    ? a.date - b.date
    : a[lang].title.localeCompare(b[lang].title);

const regenerateIDs = (registrated, coin) => {
  const { id: previousID, country } = coin;

  const year = coin.date.getFullYear();
  const orderNumber =
    coinsWithSameCountryAndYear(registrated, country, year).length + 1;

  const newID = formatID(country, year, orderNumber);

  if (previousID && previousID !== newID) {
    console.warn(
      `[WARNING] Caution! ${previousID} has been changed to ${newID}`
    );
  }

  return [
    ...registrated,
    {
      ...coin,
      id: newID
    }
  ];
};

export const sortAndGenerateIDs = (parsedCoins = [], lang) =>
  parsedCoins
    .flat()
    .sort(orderByDateAndTitle(lang))
    .reduce(regenerateIDs, []);

const simplify = str =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const compare = (wordA, wordB) =>
  (wordA.length > 2 &&
    wordB.length > 2 &&
    (wordA.includes(wordB) || wordB.includes(wordA))) ||
  parseInt(wordA) === parseInt(wordB);
export const numberOfCommonWords = (firstString, secondString) => {
  const commonWords = _.intersectionWith(
    simplify(firstString).split(/\s|-|\(|\)/),
    simplify(secondString).split(/\s|-|\(|\)/),
    (wordA, wordB) =>
      compare(wordA, wordB) ||
      compare(customTranslator(wordA), wordB) ||
      compare(wordA, customTranslator(wordB))
  );

  return commonWords.length;
};

const findSameCoinInRootLanguage = (
  rootCoins,
  coinInForeignLanguage,
  coinLanguage
) => {
  const {
    country,
    date,
    volume,
    [coinLanguage]: { title }
  } = coinInForeignLanguage;
  const year = date.getFullYear();

  let rootCoinsWithSameCountryAndYear = coinsWithSameCountryAndYear(
    rootCoins,
    country,
    year
  );

  if (rootCoinsWithSameCountryAndYear.length === 0) {
    console.error(
      `[ERROR] Coin ${country} ${year} has no matching coins in root coins`
    );
    stats.noSameYearSameCountry.push(coinInForeignLanguage);

    return;
  }

  const sameVolumeAndYearAndCountry = coinsWithAboutSameVolume(
    rootCoinsWithSameCountryAndYear,
    volume
  );

  // there is only one coin with same Volume, Year and Country
  if (sameVolumeAndYearAndCountry.length === 1) {
    stats.perfectMatches += 1;

    return sameVolumeAndYearAndCountry[0];
  }

  let othersPotentialCoins = sameVolumeAndYearAndCountry;

  // there is no others coins with same Volume, Year and Country
  if (sameVolumeAndYearAndCountry.length === 0) {
    const rootCoinVolumes = rootCoinsWithSameCountryAndYear.map(
      coin => coin.volume
    );
    console.warn(
      `[WARNING] Volume difference with coin ${country} ${date.getFullYear()} : volume is ${volume}\tFound ${rootCoinVolumes.join(
        "\t"
      )}`
    );
    othersPotentialCoins = rootCoinsWithSameCountryAndYear;
  }

  // We can’t use Volume to determine the same coin, we will use title
  const {
    titleWordsInCommon: maxTitleWordsInCommon,
    candidate: bestCandidate
  } = othersPotentialCoins.reduce(
    (bestMatch, candidate) => {
      const titleWordsInCommon = numberOfCommonWords(
        title,
        candidate[ROOT_LANGUAGE].title
      );

      if (titleWordsInCommon > bestMatch.titleWordsInCommon) {
        return {
          titleWordsInCommon,
          candidate
        };
      }

      return bestMatch;
    },
    {
      titleWordsInCommon: 0,
      candidate: {}
    }
  );

  if (maxTitleWordsInCommon >= WORDS_IN_COMMON_THRESHOLD) {
    stats.titleComparisonExceedThreshold.push(maxTitleWordsInCommon);
    return bestCandidate;
  }

  stats.titleComparisonFailedThreshold.push({
    ...coinInForeignLanguage,
    title
  });
};

export const mergeCoinsInForeignLanguage = (
  rootCoins,
  coinsToMerge,
  langOfCoins
) => {
  const merged = rootCoins;

  coinsToMerge.forEach(coinInForeignLanguage => {
    const similarCoinInRoot = findSameCoinInRootLanguage(
      rootCoins,
      coinInForeignLanguage,
      langOfCoins
    );

    if (similarCoinInRoot) {
      const similarCoinIndex = merged.findIndex(
        ({ id }) => id === similarCoinInRoot.id
      );

      merged[similarCoinIndex] = {
        ...coinInForeignLanguage,
        ...similarCoinInRoot
      };
    }
  });

  console.info(`[INFO] === STATS ===\n`);

  console.log("\x1b[32m%s\x1b[0m", `${stats.perfectMatches} perfect matches\n`);

  console.log(
    "\x1b[31m%s\x1b[0m",
    `${stats.noSameYearSameCountry.length} coins with no common country and year\n`
  );

  console.log(
    "\x1b[32m%s\x1b[0m",
    `${
      stats.titleComparisonExceedThreshold.length
    } title comparison successful (max words in common was ${Math.max(
      ...stats.titleComparisonExceedThreshold
    )})\n`
  );

  console.log(
    "\x1b[31m%s\x1b[0m",
    `${stats.titleComparisonFailedThreshold.length} title comparison failed\n`
  );

  console.log("\x1b[36m%s\x1b[0m", `${coinsToMerge.length} coins treated\n`);

  console.table(stats.titleComparisonFailedThreshold);

  return merged;
};
