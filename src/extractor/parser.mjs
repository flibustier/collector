import axios from "axios";
import cheerio from "cheerio";
import _ from "lodash";

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

  const [extractedNumber] = volume.replace(",", "").match(/[\d\s]+/) || ["0"];

  return parseInt(extractedNumber.replace(/\s/g, ""));
};

export const parseMonth = dateString => {
  const months = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre"
  ];

  for (const [index, month] of months.entries()) {
    if (
      dateString.includes(month) ||
      dateString.includes(month.toLowerCase())
    ) {
      return index;
    }
  }

  const [, number, trimestreOrSemestre] =
    dateString.match(/(\d)er?\s(trimestre|semestre)/) || [];
  if (trimestreOrSemestre) {
    return (number - 1) * (trimestreOrSemestre === "trimestre" ? 3 : 6);
  }

  if (dateString.includes("Automne")) return 9;
  if (dateString.includes("Mi-")) return 6;

  console.warn(`[WARNING] Could not found a month for ${dateString}`);

  return 0;
};

const parseFrenchDate = dateString => {
  const [year] = dateString.match(/(20[\d]{2})/) || [];
  const month = parseMonth(dateString);
  const [day] = dateString.match(/^(\d+)\s/) || [1];

  return new Date(year, month, day, 12, 0, 0, 0);
};

export const parseDate = (dateString, lang) => {
  const date =
    lang === "fr"
      ? parseFrenchDate(dateString)
      : new Date(dateString + " 12:00");
  date.setUTCHours(0, 0, 0, 0);

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
  if (isVolume(coin.fr.date) && !coin.fr.volume) {
    return {
      ...coin,
      fr: {
        ...coin.fr,
        date: fixedDate,
        volume: coin.fr.date
      }
    };
  }

  return coin;
};

export const parseRemoteCoins = async (
  lang,
  sourceURL,
  fixedDate,
  collection
) => {
  const { data } = await axios.get(sourceURL);

  const $ = cheerio.load(data);

  const tables = $("table.wikitable");

  return tables
    .map((_, el) => ({
      [lang]: {
        title: $(el)
          .find(SELECTORS[lang].NAME_SELECTOR)
          .text()
          .split("[")[0],
        country: $(el)
          .find(SELECTORS[lang].COUNTRY_SELECTOR)
          .text(),
        date: $(el)
          .find(SELECTORS[lang].DATE_SELECTOR)
          .text(),
        volume: $(el)
          .find(SELECTORS[lang].VOLUME_SELECTOR)
          .text()
          .split("[")[0]
      },
      image: $(el)
        .find(SELECTORS[lang].IMAGE_SELECTOR)
        .attr("src"),
      ...(collection ? { collection } : {})
    }))
    .get()
    .map(fixedDate ? fixDateAndVolumeInversion(fixedDate) : coin => coin)
    .filter(coin => !!coin[lang].volume && !!coin[lang].date)
    .map(parseCountryDateAndVolume(lang));
};
