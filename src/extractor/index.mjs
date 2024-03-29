import _ from "lodash";

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

let coins = [];

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

  const rootCoins = await remoteCoinsPromises[ROOT_LANGUAGE];

  for (var lang of foreignLanguages) {
    const coinsInForeignLanguage = await remoteCoinsPromises[lang];
    coins = mergeCoinsInForeignLanguage(
      rootCoins,
      coinsInForeignLanguage,
      lang
    );
  }
}

async function main() {
  coins = await readDatabase();

  await fetchWikipediaAndMerge(coins);

  console.info(`[INFO] ${coins.length} total coins`);

  if (argv["write-database"]) {
    writeDatabase(coins);
  }

  if (argv.download) {
    const id = argv.download;
    const coin = coins.find(coin => coin.id === id);
    if (!coin) {
      return console.error(`${id} not found in coin database`);
    }

    const { quality, tinypng } = argv;
    console.info(
      `downloading ${id} in ${quality} quality ${tinypng ? "with tinypng" : ""}`
    );

    if (quality === IMAGE_ALL_QUALITIES) {
      await downloadAllQualities(coin, tinypng);
    } else {
      await download(coin, quality, tinypng);
    }
  }

  if (argv["download-missings"] || argv["download-all"]) {
    console.info(
      `[INFO] Downloading images in ${argv.quality} quality (could take some time)`
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
