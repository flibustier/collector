import dotenv from "dotenv";
import fs from "fs";
import _ from "lodash";
import { basename } from "path";
import yargs from "yargs";

import {
  WIKIPEDIA_URLS,
  DATABASE_PATH,
  IMAGE_ALL_QUALITIES
} from "./constants.mjs";
import { ROOT_LANGUAGE, IMAGE_QUALITY } from "../constants.mjs";

import { parseRemoteCoins } from "./parser.mjs";
import {
  sortAndGenerateIDs,
  mergeCoinsInForeignLanguage
} from "./recognition.mjs";
import {
  download,
  downloadAllMissing,
  downloadAllQualities
} from "./image.mjs";
import Coin from "./coin.mjs";

dotenv.config();
const argv = yargs
  .option("write-database", {
    alias: "w",
    type: "boolean",
    description: "Write database file into assets/database.json"
  })
  .option("offline", {
    type: "boolean",
    description: "Don’t download Wikipedia data",
    conflicts: ["download", "download-every"]
  })
  .option("download", {
    alias: "d",
    type: "string",
    description: "Download a specific picture from coin ID",
    requiresArg: true
  })
  .option("download-every", {
    alias: "dl",
    description: "Download missing or every pictures",
    choices: ["all", "missings"],
    requiresArg: true
  })
  .option("quality", {
    alias: "q",
    description: "Chose picture quality with a download option",
    choices: [...Object.values(IMAGE_QUALITY), IMAGE_ALL_QUALITIES],
    default: IMAGE_QUALITY.MAXIMAL,
    requiresArg: true
  })
  .option("tinypng", {
    alias: "t",
    type: "boolean",
    description:
      "Use TinyPNG API to reduce picture sizes when using a download option",
    implies: ["download", "download-every"],
    coerce: () =>
      Buffer.from(`api:${process.env.TINYPNG_API_KEY}`).toString("base64")
  })
  .example(
    "$0 --write-database",
    "extract Wikipedia data and save to database.json file"
  )
  .example(
    "$0 --download MC-2007-01 --quality low",
    "download the MC-2007-01 picture in low quality"
  )
  .example(
    "$0 --download-every missings --quality all --tinypng",
    "download every missings pictures in all qualities, using tinypng api"
  ).argv;

const readLocalCoins = () =>
  new Promise(resolve => {
    fs.readFile(DATABASE_PATH, "utf8", function(err, data) {
      if (err) {
        console.warn(
          `[WARNING] no database found in ${DATABASE_PATH}, ignore if you’re creating a new database`
        );

        resolve([]);
      }
      const database = JSON.parse(data);
      console.debug(
        `[DEBUG] database ${database.version} found with ${database.coins.length} entries!`
      );

      resolve(
        database.coins.map(coin => ({
          ...coin,
          date: new Date(coin.date)
        }))
      );
    });
  });

const sortAndParseAllRemoteCoinsForEachLang = async (urls, lang) => {
  const coinsParsedAndResolvedForALang = await Promise.all(
    urls.map(({ url, fixDate, collection }) => {
      console.debug(`[DEBUG] Fetching (${lang}) ${decodeURI(basename(url))}`);
      return parseRemoteCoins(lang, url, fixDate, collection);
    })
  );

  return sortAndGenerateIDs(coinsParsedAndResolvedForALang, lang);
};

const run = async () => {
  let coins = await readLocalCoins();

  if (!argv.offline) {
    const remoteCoinsPromises = _.mapValues(
      WIKIPEDIA_URLS,
      sortAndParseAllRemoteCoinsForEachLang
    );

    const rootCoins = await remoteCoinsPromises[ROOT_LANGUAGE];

    for (var lang in remoteCoinsPromises) {
      if (lang !== ROOT_LANGUAGE) {
        const coinsInForeignLanguage = await remoteCoinsPromises[lang];
        coins = mergeCoinsInForeignLanguage(
          rootCoins,
          coinsInForeignLanguage,
          lang
        );
      }
    }
  }

  console.info(`[INFO] ${coins.length} total coins`);

  if (argv["write-database"]) {
    fs.writeFile(
      DATABASE_PATH,
      JSON.stringify(
        {
          version: new Date().toISOString().slice(0, 10),
          coins: coins.map(coin => new Coin(coin))
        },
        null,
        2
      ),
      function(err) {
        if (err) console.error(err);
        else console.debug(`database written in ${DATABASE_PATH}`);
      }
    );
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

  if (argv["download-every"]) {
    const downloadNotOnlyMissings = argv["download-every"] === "all";

    console.info(
      `[INFO] Downloading images in ${argv.quality} quality (could take some time)`
    );

    await downloadAllMissing(
      coins,
      argv.quality,
      argv.tinypng,
      downloadNotOnlyMissings
    );
  }
};

run();
