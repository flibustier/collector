import _ from "lodash";
import { logger } from "./logger.mjs";

import { WIKIPEDIA_URLS, IMAGE_ALL_QUALITIES } from "./constants.mjs";
import { ROOT_LANGUAGE } from "../constants.mjs";

import { fetchAndParseURL } from "./parser.mjs";
import {
  sortAndGenerateIDs,
  mergeCoinsInForeignLanguage
} from "./recognition.mjs";
import {
  download,
  downloadAllMissing,
  downloadAllQualities
} from "./image.mjs";
import { readDatabase, writeDatabase } from "./database.mjs";

import argv from "./argv.mjs";

const foreignLanguages = Object.keys(WIKIPEDIA_URLS).filter(
  lang => lang !== ROOT_LANGUAGE
);

const sortAndParseRemoteCoins = async (urls, lang) => {
  const coinsParsedAndResolved = await Promise.all(
    urls.map(fetchAndParseURL(lang))
  );

  return sortAndGenerateIDs(coinsParsedAndResolved, lang);
};

async function fetchWikipediaAndMerge() {
  const remoteCoinsPromises = _.mapValues(
    WIKIPEDIA_URLS,
    sortAndParseRemoteCoins
  );

  let rootCoins = await remoteCoinsPromises[ROOT_LANGUAGE];

  for (var lang of foreignLanguages) {
    const coinsInForeignLanguage = await remoteCoinsPromises[lang];
    rootCoins = mergeCoinsInForeignLanguage(
      rootCoins,
      coinsInForeignLanguage,
      lang
    );
  }

  return rootCoins;
}

const usePreviousVersionToFillEmptyFields = (coins, previously) =>
  coins.map(coin => ({
    ...previously.find(({ id }) => id === coin.id),
    ..._.omitBy(coin, field => !field)
  }));

async function main() {
  const previously = await readDatabase();

  const coins = await fetchWikipediaAndMerge();

  logger.info(`${coins.length} total coins`);

  if (argv["write-database"]) {
    writeDatabase(usePreviousVersionToFillEmptyFields(coins, previously));
  }

  if (argv.download) {
    const id = argv.download;
    const coin = coins.find(coin => coin.id === id);
    if (!coin) {
      return logger.error(`${id} not found in coin database`);
    }

    const { quality, tinypng } = argv;
    logger.info(
      `downloading ${id} in ${quality} quality ${tinypng ? "with tinypng" : ""}`
    );

    if (quality === IMAGE_ALL_QUALITIES) {
      await downloadAllQualities(coin, tinypng);
    } else {
      await download(coin, quality, tinypng);
    }
  }

  if (argv["download-missings"] || argv["download-all"]) {
    logger.info(
      `Downloading images in ${argv.quality} quality (could take some time)`
    );

    await downloadAllMissing(
      coins,
      argv.quality,
      argv.tinypng,
      argv["download-all"]
    );
  }
}

main();
