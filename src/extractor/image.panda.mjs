import axios from "axios";

import { logger } from "./logger.mjs";

const PANDA_API_SHRINK = "https://api.tinify.com/shrink";
export const PANDA_API_HEADERS = PANDA_API_TOKEN => ({
  headers: {
    Authorization: `Basic ${PANDA_API_TOKEN}`
  }
});

export const sendToPanda = async (sourceURL, pandaToken) => {
  try {
    const {
      headers: { location }
    } = await axios.post(
      PANDA_API_SHRINK,
      {
        source: {
          url: sourceURL
        }
      },
      PANDA_API_HEADERS(pandaToken)
    );

    return location;
  } catch (error) {
    logger.error(
      "Got an error when sending to Tiny PNG API (e.g. your api key is invalid):",
      error.message
    );
  }
};
