import axios from 'axios'
import fs from 'fs'
import { basename } from 'path';
import ProgressBar from 'progress';

import { IMAGE_DIRECTORY } from './constants.mjs';
import { IMAGE_QUALITY, IMAGE_QUALITY_WIDTH } from '../constants.mjs'
import { IMAGE_ALL_QUALITIES } from './constants.mjs';

const PANDA_API_KEY = "YXBpOm5XVFRSNTVabVE5cnFROWpsSFlteTA3dDVUMG40TVJN"//"YXBpOmpZN1JxV05mcVk2R3lYaEY1UWhGMTB3UU1xcmpuR0JZ"//"YXBpOjRTajRrdDFWVDlGWTRMUjlYRGhEUGpaNlhOYnc5NGpr"
const PANDA_API_HEADERS = {
    headers: {
        Authorization: `Basic ${PANDA_API_KEY}`
    }
}
const PANDA_API_SHRINK = "https://api.tinify.com/shrink"

export const getFileName = URL => decodeURIComponent(basename(URL))

const downloadImage = async (url, destination, withPanda = false) => {
    try {
        const { data, headers: { 'content-length': totalLength } } = await axios({
            method: 'GET',
            url,
            responseType: 'stream',
            ...(withPanda ? PANDA_API_HEADERS : {})
        });

        const progressBar = new ProgressBar(`Downloading [:bar] :percent :elapsed`, {
            width: 40,
            total: parseInt(totalLength, 10)
        })

        data.on('data', (chunk) => progressBar.tick(chunk.length))
        data.pipe(fs.createWriteStream(destination));
    } catch (error) {
        console.error(`[ERROR] Received during processing ${getFileName(destination)}`, error.message)
    }
}

export const getImageURLForQuality = (imageSourceURL, quality) => {
    const protocol = 'http:'
    switch (quality) {
        case IMAGE_QUALITY.LOW:
            return protocol + imageSourceURL.replace('150px', IMAGE_QUALITY_WIDTH.LOW)
        case IMAGE_QUALITY.MEDIUM:
            return protocol + imageSourceURL.replace('150px', IMAGE_QUALITY_WIDTH.MEDIUM)
        case IMAGE_QUALITY.MAXIMAL:
            return protocol + imageSourceURL.split('/150px')[0].replace('/thumb', '')
    }
}

const getLocalImageFilePath = (imageURL, quality) => `${IMAGE_DIRECTORY}/${quality}/${getFileName(imageURL)}`;


const sendToPanda = async (sourceURL) => {
    try {
        const { headers: { location } } = await axios.post(PANDA_API_SHRINK, {
            "source": {
                "url": sourceURL
            }
        }, PANDA_API_HEADERS)

        return location;
    } catch (error) {
        console.error('[ERROR] Got an error when sending to Tiny PNG API (e.g. your api key is invalid):', error.message)
    }
}

export const downloadAllQualities = async (coin, withPanda) => Promise.all(Object.values(IMAGE_QUALITY).map(quality => download(coin, quality, withPanda)))

export const download = async ({ image }, quality = IMAGE_QUALITY.MAXIMAL, withPanda = false) => {
    const sourceURL = getImageURLForQuality(image, quality);
    const imageLocation = withPanda ? await sendToPanda(sourceURL) : sourceURL;
    const imageDestination = getLocalImageFilePath(sourceURL, quality)

    await downloadImage(imageLocation, imageDestination, withPanda);
}

const imagePathForQuality = (imageSourceURL, quality) => {
    const sourceURLForQuality = getImageURLForQuality(imageSourceURL, quality);
    return getLocalImageFilePath(sourceURLForQuality, quality);
}

const isImageMissing = quality => ({ image }) => image && !fs.existsSync(imagePathForQuality(image, quality))

export const downloadAllMissing = (coins, quality = IMAGE_QUALITY.MAXIMAL, withPanda = false, overwrite = false) => {
    if (quality === IMAGE_ALL_QUALITIES) {
        return Promise.all(Object.values(IMAGE_QUALITY).map(singleQuality => downloadAllMissing(coins, singleQuality, withPanda)))
    }
    const coinsToDownload = !overwrite ? coins.filter(isImageMissing(quality)) : coins.filter(coin => coin.image);

    console.info(`[INFO] Downloading ${coinsToDownload.length} images`);

    return Promise.all(coinsToDownload.map(coin => download(coin, quality, withPanda)))
} 
