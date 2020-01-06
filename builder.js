const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const _ = require('lodash');
const { basename } = require('path');

const { WIKIPEDIA_URL, NAME_SELECTOR, DATE_SELECTOR, COUNTRY_SELECTOR, VOLUME_SELECTOR, IMAGE_SELECTOR, IMAGE_DIRECTORY, DATABASE_PATH, DATABASE_VERSION, POSSIBLE_ARGS, ISO_3166_1_ALPHA_2 } = require('./builder.constants.js');

const args = process.argv.slice(2);

const getImageFileName = imagePath => decodeURI(basename(imagePath))

const translateMonth = str => {
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']

    for (var i = 0; i < 12; i++) {
        const month = months[i];
        if (str.includes(month) || str.includes(month.toLowerCase())) {
            return i;
        }
    }

    const cutting = str.match(/(\d)er?\s(trimestre|semestre)/);

    if (cutting) {
        return (cutting[1] - 1) * (cutting[2] === 'trimestre' ? 3 : 6) + 1;
    }

    if (str.includes('Automne')) return 9;
    if (str.includes('Mi-')) return 6;

    console.warn(`month not found for ${str}`)

    return 1;
}

const dateConverter = rawDate => {
    const [year] = rawDate.match(/(20[\d]{2})/) || [];

    const month = translateMonth(rawDate)

    const [day] = rawDate.match(/^(\d+)\s/) || [1];

    const date = new Date(year, month, day, 12, 0, 0, 0);
    date.setUTCHours(0, 0, 0, 0);

    return date;
}

const volumeConverter = volume => {
    const millionDetected = volume.match(/([\d,.]+)\smillions?/)

    if (millionDetected) return Math.round(parseFloat(millionDetected[1].replace(',', '.')) * 1000000);

    const [extract] = volume.match(/[\d\s]+/) || ['0']

    return parseInt(extract.replace(/\s/g, ''))
}

const parseCountryDateAndVolume = coin => ({
    ...coin,
    country: ISO_3166_1_ALPHA_2[coin.fr.country],
    date: dateConverter(coin.fr.date),
    volume: volumeConverter(coin.fr.volume)
})

const coinsWithSameCountryAndYear = (coins, country, year) => coins.filter(coin => coin.country === country && coin.date.getFullYear() === year)

const formatID = (country, year, order) => `${country}-${year}-${order}`

const regenerateID = (registrated, coin) => {
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

const isVolume = str => str.includes("pièces")

const fixDateAndVolumeInversionIfOptionActivated = () => {
    // fix-date is activated with a date
    if (args.includes(POSSIBLE_ARGS.FIX_DATE)) {
        const suggestedDate = args[args.indexOf(POSSIBLE_ARGS.FIX_DATE) + 1];
        if (suggestedDate) {
            // if we have a suggested date, we return a function which will fix the date
            return coin => isVolume(coin.fr.date) && !coin.fr.volume ? {
                ...coin,
                fr: {
                    ...coin.fr,
                    date: suggestedDate,
                    volume: coin.fr.date,
                }
            } : coin;
        }
        console.error(`${POSSIBLE_ARGS.FIX_DATE} activated without giving a suggested date`)
    }
    // else we return an meaningless function
    return coin => coin;
}

const getFullSizeImageLink = el => (el.find(IMAGE_SELECTOR).attr('src') || '').split('/150px')[0].replace('/thumb', '')

const parseRemoteCoins = async () => {
    const { data } = await axios.get(WIKIPEDIA_URL)

    const $ = cheerio.load(data);

    const tables = $('table.wikitable')

    return tables.map((_, el) => ({
        fr: {
            title: $(el).find(NAME_SELECTOR).text().split('[')[0],
            country: $(el).find(COUNTRY_SELECTOR).text(),
            date: $(el).find(DATE_SELECTOR).text(),
            volume: $(el).find(VOLUME_SELECTOR).text().split('[')[0],
        },
        image: {
            thumb: $(el).find(IMAGE_SELECTOR).attr('src'),
            fullsize: {
                link: getFullSizeImageLink($(el)),
                file: getImageFileName(getFullSizeImageLink($(el))),
            }
        }
    }))
        .get()
        .map(fixDateAndVolumeInversionIfOptionActivated())
        .filter(coin => !!coin.fr.volume && !!coin.fr.date)
        .map(parseCountryDateAndVolume)
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

const download = async imagePath => axios({ method: 'GET', url: `http:${imagePath}`, responseType: 'stream' })
    .then(response => response.data.pipe(fs.createWriteStream(`${IMAGE_DIRECTORY}/${getImageFileName(imagePath)}`)));

const downloadAllFullsize = array => {
    return Promise.all(array.filter(coin => coin.image.fullsize.link).map(coin => download(coin.image.fullsize.link)))
}

const mergeCoins = (existing, newbies) =>  {
    const merged = _.unionWith(existing, newbies, (a, b) => _.isEqual(a.fr, b.fr));
    if (merged.length - existing.length > 0) console.info(`[INFO] ${merged.length - existing.length} new entries will be added!`)
    return merged;
}

const orderByDateAndTitle = (a, b) => a.date - b.date !== 0 ? a.date - b.date : a.fr.title.localeCompare(b.fr.title);

const run = async () => {
    const localCoins = await readLocalCoins();

    const parsedRemoteCoins = await parseRemoteCoins();

    console.info(`[INFO] ${parsedRemoteCoins.length} remote coins extracted!`);

    const coins = mergeCoins(localCoins, parsedRemoteCoins)
        .sort(orderByDateAndTitle)
        .reduce(regenerateID, [])

    console.info(`[INFO] ${coins.length} total coins`)

    if (args[0] === "--download" && args[1].match(/\w{2}-\d{4}-\d{2}/)) {
        console.info(`downloading ${args[1]}`)
        const coin = coins.find(coin => coin.id === args[1])
        if (coin) {
            await download(coin.image.fullsize.link)
        } else {
            console.error(`${args[1]} not found in coin database`)
        }
    }

    if (args.includes("--download-all")) {
        console.info("[INFO] Downloading all fullsize images (could take some time)")
        await downloadAllFullsize(parsedRemoteCoins)
    }

    if (args.includes("--write-database")) {
        fs.writeFile(DATABASE_PATH, JSON.stringify({
            version: DATABASE_VERSION,
            coins
        }, null, 2), function (err) {
            if (err) console.error(err);
            else console.debug(`database written in ${DATABASE_PATH}`);
        });
    }
}

run()
