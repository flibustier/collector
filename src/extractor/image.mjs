import axios from "axios";
import fs from "fs";
import { basename } from "path";
import ProgressBar from "progress";

import { logger } from "./logger.mjs";
import { IMAGE_DIRECTORY } from "./constants.mjs";
import { IMAGE_QUALITY, IMAGE_QUALITY_WIDTH } from "../constants.mjs";
import { IMAGE_ALL_QUALITIES } from "./constants.mjs";
import { PANDA_API_HEADERS, sendToPanda } from "./image.panda.mjs";

const MAX_PIXEL_SIZE = 1000;
const RESIZE_INSTRUCTION = {
  resize: { method: "fit", width: MAX_PIXEL_SIZE, height: MAX_PIXEL_SIZE }
};

export const getFileName = URL => decodeURIComponent(basename(URL));

const downloadImage = async (
  url,
  destination,
  resize = false,
  pandaToken = false
) => {
  try {
    const {
      data,
      headers: { "content-length": totalLength }
    } = await axios({
      method: resize ? "POST" : "GET",
      url,
      responseType: "stream",
      ...(pandaToken ? PANDA_API_HEADERS(pandaToken) : {}),
      data: resize ? RESIZE_INSTRUCTION : {}
    });

    const progressBar = new ProgressBar(
      `Downloading [:bar] :percent :elapsed`,
      {
        width: 40,
        total: parseInt(totalLength, 10)
      }
    );

    data.on("data", chunk => progressBar.tick(chunk.length));
    data.pipe(fs.createWriteStream(destination));
  } catch (error) {
    logger.error(
      `Received during processing ${getFileName(destination)}`,
      error.message
    );
    throw error;
  }
};

export const getImageURLForQuality = (imageSourceURL, quality) => {
  const protocol = "http:";
  switch (quality) {
    case IMAGE_QUALITY.LOW:
      return (
        protocol + imageSourceURL.replace("150px", IMAGE_QUALITY_WIDTH.LOW)
      );
    case IMAGE_QUALITY.MEDIUM:
      return (
        protocol + imageSourceURL.replace("150px", IMAGE_QUALITY_WIDTH.MEDIUM)
      );
    case IMAGE_QUALITY.MAXIMAL:
      return protocol + imageSourceURL.split("/150px")[0].replace("/thumb", "");
  }
};

const getLocalImageFilePath = (imageURL, quality) =>
  `${IMAGE_DIRECTORY}/${quality}/${getFileName(imageURL)}`;

export const downloadAllQualities = async (coin, pandaToken) =>
  Promise.all(
    Object.values(IMAGE_QUALITY).map(quality =>
      download(coin, quality, pandaToken)
    )
  );

export const download = async (
  { image },
  quality = IMAGE_QUALITY.MAXIMAL,
  pandaTokens = false,
  currentToken = 0,
) => {
  if (pandaTokens && currentToken >= pandaTokens.length) {
    logger.error(
      `No token available: ${pandaTokens.length} tokens gived, ${currentToken} used`
    );

    return;
  }

  const sourceURL = getImageURLForQuality(image, quality);
  const imageLocation = pandaTokens
    ? await sendToPanda(sourceURL, pandaTokens[currentToken])
    : sourceURL;
  const imageDestination = getLocalImageFilePath(sourceURL, quality);

  const shouldResize = quality === IMAGE_QUALITY.MAXIMAL;

  try {
    await downloadImage(
      imageLocation,
      imageDestination,
      shouldResize,
      pandaTokens[currentToken]
    );
  } catch (error) {
    await download({ image }, quality, pandaTokens, currentToken + 1);
  }
};

const imagePathForQuality = (imageSourceURL, quality) => {
  const sourceURLForQuality = getImageURLForQuality(imageSourceURL, quality);

  return getLocalImageFilePath(sourceURLForQuality, quality);
};

const isImageMissing = quality => ({ image }) =>
  image && !fs.existsSync(imagePathForQuality(image, quality));

export const downloadAllMissing = (
  coins,
  quality = IMAGE_QUALITY.MAXIMAL,
  pandaTokens = false,
  overwrite = false
) => {
  if (quality === IMAGE_ALL_QUALITIES) {
    return Promise.all(
      Object.values(IMAGE_QUALITY).map(singleQuality =>
        downloadAllMissing(coins, singleQuality, pandaTokens)
      )
    );
  }
  const coinsToDownload = !overwrite
    ? coins.filter(isImageMissing(quality))
    : coins.filter(coin => coin.image);

  logger.info(`Downloading ${coinsToDownload.length} images`);

  return Promise.all(
    coinsToDownload.map(coin => download(coin, quality, pandaTokens))
  );
};
