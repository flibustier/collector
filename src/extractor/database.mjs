import fs from "fs";

import Coin from "./coin.mjs";
import { DATABASE_PATH } from "./constants.mjs";

export const writeDatabase = coins => {
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
      else console.info(`[INFO] Database written in ${DATABASE_PATH}`);
    }
  );
};

export const readDatabase = () =>
  new Promise(resolve => {
    fs.readFile(DATABASE_PATH, "utf8", function(err, data) {
      if (err) {
        console.warn(
          `[WARNING] No database found in ${DATABASE_PATH}, ignore this message if you’re creating a new database`
        );

        resolve([]);
      }
      const database = JSON.parse(data);
      console.debug(
        `[DEBUG] Database ${database.version} found with ${database.coins.length} entries!`
      );

      resolve(
        database.coins.map(coin => ({
          ...coin,
          date: new Date(coin.date)
        }))
      );
    });
  });
