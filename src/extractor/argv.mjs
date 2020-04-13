import dotenv from "dotenv";
import yargs from "yargs";

import { IMAGE_ALL_QUALITIES } from "./constants.mjs";
import { IMAGE_QUALITY } from "../constants.mjs";

dotenv.config();
export default yargs
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
