import fs from 'fs';
import _ from 'lodash';
import { basename } from 'path';

import { WIKIPEDIA_URLS, DATABASE_PATH, POSSIBLE_ARGS, IMAGE_ALL_QUALITIES } from './constants.mjs';

import { parseRemoteCoins } from './parser.mjs';
import { download, downloadAllMissing, downloadAllQualities, getFileName } from './image.mjs'
import { getImageURLForQuality } from './image.mjs';
import { IMAGE_QUALITY } from '../constants.mjs';

const args = process.argv.slice(2);


const coinsWithSameCountryAndYear = (coins, country, year) => coins.filter(coin => coin.country === country && coin.date.getFullYear() === year)

const formatID = (country, year, order) => `${country}-${year}-${order}`

const regenerateIDs = (registrated, coin) => {
    const { country } = coin;
    const year = coin.date.getFullYear();

    const id = formatID(country, year, ('0' + (coinsWithSameCountryAndYear(registrated, country, year).length + 1)).slice(-2));

    if (coin.id && coin.id !== id) {
        console.warn(`[WARNING] Caution! ${coin.id} has been changed to ${id}`)
    }

    return [...registrated, {
        ...coin,
        id
    }]
}
const readLocalCoins = () => new Promise((resolve) => {
    fs.readFile(DATABASE_PATH, 'utf8', function (err, data) {
        if (err) {
            console.warn(`[WARNING] no database found in ${DATABASE_PATH}, ignore if you’re creating a new database`)

            resolve([]);
        }
        const database = JSON.parse(data);
        console.debug(`[DEBUG] database ${database.version} found with ${database.coins.length} entries!`)

        resolve(database.coins.map(coin => ({
            ...coin,
            date: new Date(coin.date)
        })))
    });
})

// todo: eng + compare field by field
const mergeCoins = (existing, newbies) => {
    const merged = _.unionWith(existing, newbies, (a, b) => {
        return _.isEqual(a.fr, b.fr)
    });
    if (merged.length - existing.length > 0) console.info(`[INFO] ${merged.length - existing.length} new entries will be added!`)
    return merged;
}

const orderByDateAndTitle = (a, b) => a.date - b.date !== 0 ? a.date - b.date : a.fr.title.localeCompare(b.fr.title);

const getPromisesFromURLS = () => _.flatten(Object.entries(WIKIPEDIA_URLS).map(([lang, urls]) => urls.map(({ url, fixDate, collection }) => {
    console.debug(`[DEBUG] Fetching (${lang}) ${decodeURI(basename(url))}`)
    return parseRemoteCoins(lang, url, fixDate, collection)
})));

const getQualityFromArgs = args => {
    if (args.includes(POSSIBLE_ARGS.QUALITY)) {
        const qualityIndex = args.findIndex(str => str === POSSIBLE_ARGS.QUALITY)
        if (qualityIndex + 1 < args.length) {
            const quality = args[qualityIndex + 1]
            if (Object.values(IMAGE_QUALITY).includes(quality) || quality === IMAGE_ALL_QUALITIES) {
                return quality;
            } 
        }
    }
    return undefined
}

const savedModel = ({
    id,
    date,
    volume,
    image,
    fr
}) => ({
    id,
    date,
    volume,
    image: image ? getFileName(getImageURLForQuality(image, IMAGE_QUALITY.MAXIMAL)) : '',
    fr: {
        title: fr.title,
        date: fr.date,
        volume: fr.volume
    }
})

const isID = (str) => /\w{2}-\d{4}-\d{2}/.test(str)

const run = async () => {
    const localCoins = await readLocalCoins();

    const remoteCoins = await Promise.all(getPromisesFromURLS());

    const parsedRemoteCoins = _.flatten(remoteCoins)

    console.info(`[INFO] ${parsedRemoteCoins.length} remote coins extracted!`);

    const coins = parsedRemoteCoins//mergeCoins(localCoins, parsedRemoteCoins)
        .sort(orderByDateAndTitle)
        .reduce(regenerateIDs, [])

    console.info(`[INFO] ${coins.length} total coins`)

    if (args.includes(POSSIBLE_ARGS.WRITE_DB)) {
        fs.writeFile(DATABASE_PATH, JSON.stringify({
            version: new Date().toISOString().slice(0, 10),
            coins: coins.map(savedModel)
        }, null, 2), function (err) {
            if (err) console.error(err);
            else console.debug(`database written in ${DATABASE_PATH}`);
        });
    }


    if (args.includes(POSSIBLE_ARGS.DOWNLOAD) && args.find(isID)) {
        const withPanda = args.includes(POSSIBLE_ARGS.WITH_PANDA);
        const id = args.find(isID)
        const coin = coins.find(coin => coin.id === id)
        if (!coin) {
            return console.error(`${id} not found in coin database`)
        }
        
        const quality = getQualityFromArgs(args);
        console.info(`downloading ${id} ${quality ? `in ${quality} quality` : ''} ${withPanda ? 'with tinypng' : ''}`)

        if (quality === IMAGE_ALL_QUALITIES) {
            await downloadAllQualities(coin, withPanda)
        } else {
            await download(coin, quality, withPanda)
        }
    }

    if (args.includes(POSSIBLE_ARGS.DOWNLOAD_ALL)) {
        console.info("[INFO] Downloading all missings images (could take some time)")
        await downloadAllMissing(coins)
    }


}

run()
