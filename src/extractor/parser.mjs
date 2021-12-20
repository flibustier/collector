import axios from "axios";
import cheerio from "cheerio";
import _ from "lodash";
import { basename } from "path";

import { logger } from "./logger.mjs";
import { parseFrenchDate } from "./parser.french.mjs";
import { SELECTORS } from "./parser.constants.mjs";

import fr from "../locales/fr.json";
import en from "../locales/en.json";

const ISO_3166_1_ALPHA_2 = {
  fr: _.invert(fr.countries),
  en: _.invert(en.countries)
};

export const parseCountryToISO = (country, lang) =>
  ISO_3166_1_ALPHA_2[lang][country];

export const parseVolume = volume => {
  const millionDetected = volume.match(/([\d,.]+)\smillions?/);

  if (millionDetected)
    return Math.round(
      parseFloat(millionDetected[1].replace(",", ".")) * 1000000
    );

  const [extractedNumber] = volume.replace(/,|\./g, "").match(/[\d\s]+/) || [
    "0"
  ];

  return parseInt(extractedNumber.replace(/\s/g, ""));
};

export const parseDate = (dateString, lang) => {
  const date =
    lang === "fr"
      ? parseFrenchDate(dateString)
      : new Date(dateString + " 12:00");
  date.setUTCHours(0, 0, 0, 0);

  if (isNaN(date.getTime())) {
    logger.warn(`Invalid (${lang}) Date for « ${dateString} »`);
  }

  return date;
};

const parseCountryDateAndVolume = lang => coin => ({
  ...coin,
  country: parseCountryToISO(coin[lang].country, lang),
  date: parseDate(coin[lang].date, lang),
  volume: parseVolume(coin[lang].volume)
});

const isVolume = str => str.includes("pièces") || str.includes("coins");

const fixDateAndVolumeInversion = fixedDate => coin => {
  if (coin.fr && isVolume(coin.fr.date) && !coin.fr.volume) {
    return {
      ...coin,
      fr: {
        ...coin.fr,
        date: fixedDate || coin.fr.dateBis,
        volume: coin.fr.date
      }
    };
  }

  return coin;
};

export const cleanStr = str => str.trim().split("[")[0];

export const cleanDate = dateString => {
  if (dateString.includes("FDI")) {
    return dateString.split("FDC")[0].slice("FDI:[13] ".length);
  }
  if (dateString.includes("rolls")) {
    return /\((sets|proof)\)(.+)\(rolls\)/.exec(dateString.trim())[2].trim();
  }
  if (dateString.includes("–")) {
    return dateString.split("–")[1].trim();
  }
  return cleanStr(dateString);
};

const formatCoin = ($, lang, collection) => (_, el) => ({
  [lang]: {
    title: cleanStr(
      $(el)
        .find(SELECTORS[lang].TITLE_SELECTOR)
        .text()
    ),
    country: $(el)
      .find(SELECTORS[lang].COUNTRY_SELECTOR)
      .text(),
    date: cleanDate(
      $(el)
        .find(SELECTORS[lang].DATE_SELECTOR)
        .text()
    ),
    dateBis: cleanDate(
      $(el)
        .find(SELECTORS[lang].DATE_BIS_SELECTOR)
        .text()
    ),
    volume: cleanStr(
      $(el)
        .find(SELECTORS[lang].VOLUME_SELECTOR)
        .text()
    )
  },
  ...(SELECTORS[lang].IMAGE_SELECTOR
    ? {
        image: $(el)
          .find(SELECTORS[lang].IMAGE_SELECTOR)
          .attr("src")
      }
    : {}),
  collection
});

export const fetchAndParseURL = lang => async ({
  url,
  fixDate,
  collection
}) => {
  logger.debug(`Fetching (${lang}) ${decodeURI(basename(url))}`);

  const { data } = await axios.get(url);

  const $ = cheerio.load(data);

  const tables = $(SELECTORS[lang].MAIN_SELECTOR);

  return tables
    .map(formatCoin($, lang, collection))
    .get()
    .map(fixDateAndVolumeInversion(fixDate))
    .filter(
      ({ [lang]: { country, date, volume } }) =>
        country && volume && date && date !== "TBA"
    )
    .map(parseCountryDateAndVolume(lang))
    .filter(({ country, date, volume }) => country && !isNaN(date) && volume);
};
