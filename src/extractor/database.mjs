import fs from "fs";

import { logger } from "./logger.mjs";
import Coin from "./coin.mjs";
import { DATABASE_PATH } from "./constants.mjs";

const serialize = coin => {
  const c = new Coin(coin);
  c.image = c.image.replace("http:", "");

  return c;
};

export const writeDatabase = coins => {
  fs.writeFile(
    DATABASE_PATH,
    JSON.stringify(
      {
        version: new Date().toISOString().slice(0, 10),
        coins: coins.map(serialize)
      },
      null,
      2
    ),
    function(err) {
      if (err) logger.error(err);
      else logger.info(`Database written in ${DATABASE_PATH}`);
    }
  );
};

export const readDatabase = () =>
  new Promise(resolve => {
    fs.readFile(DATABASE_PATH, "utf8", function(err, data) {
      if (err) {
        logger.warn(
          `No database found in ${DATABASE_PATH}, ignore this message if you’re creating a new database`
        );

        resolve([]);
      }
      const database = JSON.parse(data);
      logger.debug(
        `Database ${database.version} found with ${database.coins.length} entries!`
      );

      resolve(
        database.coins.map(coin => ({
          ...coin,
          date: new Date(coin.date)
        }))
      );
    });
  });
