import axios from "axios";
import fs from "fs";
import { basename } from "path";
import ProgressBar from "progress";

import { IMAGE_DIRECTORY } from "./constants.mjs";
import { IMAGE_QUALITY, IMAGE_QUALITY_WIDTH } from "../constants.mjs";
import { IMAGE_ALL_QUALITIES } from "./constants.mjs";

const MAX_PIXEL_SIZE = 1000;

const PANDA_API_SHRINK = "https://api.tinify.com/shrink";
const PANDA_API_HEADERS = PANDA_API_TOKEN => ({
  headers: {
    Authorization: `Basic ${PANDA_API_TOKEN}`
  }
});
const RESIZE_INSTRUCTION = {
  data: {
    resize: { method: "scale", width: MAX_PIXEL_SIZE, height: MAX_PIXEL_SIZE }
  }
};

const sendToPanda = async (sourceURL, pandaToken) => {
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
    console.error(
      "[ERROR] Got an error when sending to Tiny PNG API (e.g. your api key is invalid):",
      error.message
    );
  }
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
      method: "GET",
      url,
      responseType: "stream",
      ...(pandaToken ? PANDA_API_HEADERS(pandaToken) : {}),
      ...(resize ? RESIZE_INSTRUCTION : {})
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
    console.error(
      `[ERROR] Received during processing ${getFileName(destination)}`,
      error.message
    );
  }
};

export const getImageURLForQuality = (imageSourceURL, quality) => {
  console.log(imageSourceURL);
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
  pandaToken = false
) => {
  const sourceURL = getImageURLForQuality(image, quality);
  const imageLocation = pandaToken
    ? await sendToPanda(sourceURL, pandaToken)
    : sourceURL;
  const imageDestination = getLocalImageFilePath(sourceURL, quality);

  const shouldResize = quality === IMAGE_QUALITY.MAXIMAL;

  await downloadImage(
    imageLocation,
    imageDestination,
    shouldResize,
    pandaToken
  );
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
  pandaToken = false,
  overwrite = false
) => {
  if (quality === IMAGE_ALL_QUALITIES) {
    return Promise.all(
      Object.values(IMAGE_QUALITY).map(singleQuality =>
        downloadAllMissing(coins, singleQuality, pandaToken)
      )
    );
  }
  const coinsToDownload = !overwrite
    ? coins.filter(isImageMissing(quality))
    : coins.filter(coin => coin.image);

  console.info(`[INFO] Downloading ${coinsToDownload.length} images`);

  return Promise.all(
    coinsToDownload.map(coin => download(coin, quality, pandaToken))
  );
};
