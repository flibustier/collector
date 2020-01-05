const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const { basename } = require('path');

const { WIKIPEDIA_URL, NAME_SELECTOR, DATE_SELECTOR, VOLUME_SELECTOR, IMAGE_SELECTOR, IMAGE_DIRECTORY, DATABASE_PATH, ISO_3166_1_ALPHA_2 } = require('./builder.constants.js');

const getImageFileName = imagePath => decodeURI(basename(imagePath))

const download = async imagePath => axios({ method: 'GET', url: `http:${imagePath}`, responseType: 'stream' })
    .then(response => response.data.pipe(fs.createWriteStream(`${IMAGE_DIRECTORY}/${getImageFileName(imagePath)}`)));

const downloadAllFullsize = array => {
    return Promise.all(array.filter(coin => coin.imageFullsize).map(coin => download(coin.imageFullsize)))
}

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

const sameCountryAndYear = (a, b) => a.country === b.country && a.date.getFullYear() === b.date.getFullYear()

const createID = (registrated, coin) => {
    return [...registrated, {
        id: `${coin.country}-${coin.date.getFullYear()}-${('0' + (registrated.filter(p => sameCountryAndYear(p, coin)).length + 1)).slice(-2)}`,
        ...coin
    }]
}

const parseCountryDateAndVolume = coin => ({
    ...coin,
    country: ISO_3166_1_ALPHA_2[coin.fr.country],
    date: dateConverter(coin.fr.date),
    volume: volumeConverter(coin.fr.volume)
})

const getFullSizeImageLink = el => (el.find(IMAGE_SELECTOR).attr('src') || '').split('/150px')[0].replace('/thumb', '')

const run = async () => {
    const { data } = await axios.get(WIKIPEDIA_URL)

    const $ = cheerio.load(data);

    const tables = $('table.wikitable')

    const coins = tables.map((_, el) => ({
        fr: {
            title: $(el).find(NAME_SELECTOR).text().split('[')[0],
            country: $(el).find('b span > a').text(),
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
        .filter(coin => !!coin.fr.volume && !!coin.fr.date)
        .map(parseCountryDateAndVolume)
        .sort((a, b) => a.date < b.date ? -1 : 1)
        .reduce(createID, [])

    console.info(`${coins.length} coins extracted!`);

    fs.writeFile(DATABASE_PATH, JSON.stringify(coins, null, 2), function (err) {
        if (err) {
            console.error(err);
        } else {
            console.debug(`database written in ${DATABASE_PATH}`);
        }
    });

    const args = process.argv.slice(2);

    if (args[0] === "--download" && args[1].match(/\w{2}-\d{4}-\d{2}/)) {
        console.info(`downloading ${args[1]}`)
        const coin = coins.find(coin => coin.id === args[1])
        if (coin) {
            await download(coin.image.fullsize.link)
        } else {
            console.error(`${args[1]} not found in coin database`)
        }
    }

    if (args[0] === "--download-all") {
        console.info("downloading all fullsize images (could take some time)")
        await downloadAllFullsize(coins)
    }
}

run()
