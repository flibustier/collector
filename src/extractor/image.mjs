import axios from 'axios'
import fs from 'fs'
import { basename } from 'path';

import { IMAGE_DIRECTORY } from './constants.mjs';
import { IMAGE_QUALITY, IMAGE_QUALITY_WIDTH } from '../constants.mjs'

const PANDA_API_KEY = "YXBpOjRTajRrdDFWVDlGWTRMUjlYRGhEUGpaNlhOYnc5NGpr"
const PANDA_API_HEADERS = {
    headers: {
        Authorization: `Basic ${PANDA_API_KEY}`
    }
}
const PANDA_API_SHRINK = "https://api.tinify.com/shrink"

export const getFileName = URL => decodeURI(basename(URL))

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

const getLocalImageFilePath = (imageURL, quality) => `${IMAGE_DIRECTORY}/${quality}/${getFileName(imageURL)}`


const isImageMissing = quality => ({ image }) => image && !fs.existsSync(getLocalImageFilePath(image, quality))


const downloadImage = async (url, destination, withPanda = false) => {
    return axios({
        method: 'GET',
        url,
        responseType: 'stream',
        ...(withPanda ? PANDA_API_HEADERS : {})
    })
        .then(({ data }) => data.pipe(fs.createWriteStream(destination)));
}


const sendToPanda = async (sourceURL) => {
    const { headers: { location } } = await axios.post(PANDA_API_SHRINK, {
        "source": {
            "url": sourceURL
        }
    }, PANDA_API_HEADERS)

    return location;
}

export const downloadAllQualities = async (coin, withPanda) => Promise.all(Object.values(IMAGE_QUALITY).map(quality => download(coin, quality, withPanda)))

export const download = async ({ image }, quality = IMAGE_QUALITY.MAXIMAL, withPanda = false) => {
    const sourceURL = getImageURLForQuality(image, quality);
    const imageLocation = withPanda ? await sendToPanda(sourceURL) : sourceURL;
    const imageDestination = getLocalImageFilePath(sourceURL, quality)

    await downloadImage(imageLocation, imageDestination, withPanda);
}

export const downloadAllMissing = (coins, quality = IMAGE_QUALITY.MAXIMAL, withPanda = false) => Promise.all(coins.filter(isImageMissing(quality)).map(coin => download(coin, quality, withPanda)))
