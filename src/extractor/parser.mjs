import axios from 'axios';
import cheerio from 'cheerio';
import _ from 'lodash';
import { basename } from 'path';

import { SELECTORS } from './parser.constants.mjs';

import fr from '../locales/fr.json'
import en from '../locales/en.json'

const ISO_3166_1_ALPHA_2 = {
    fr: _.invert(fr.countries),
    en: _.invert(en.countries)
};

const convertCountryToISO = (lang, country) => ISO_3166_1_ALPHA_2[lang][country];

const extractMonth = str => {
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

const dateConverter = dateString => {
    let date = new Date(dateString);

    if (!date.getTime()) {
        const [year] = dateString.match(/(20[\d]{2})/) || [];
        const month = extractMonth(dateString)
        const [day] = dateString.match(/^(\d+)\s/) || [1];

        date = new Date(year, month, day, 12, 0, 0, 0);
    }
    date.setUTCHours(0, 0, 0, 0);

    return date;
}

const volumeConverter = volume => {
    const millionDetected = volume.match(/([\d,.]+)\smillions?/)

    if (millionDetected) return Math.round(parseFloat(millionDetected[1].replace(',', '.')) * 1000000);

    const [extractedNumber] = volume.replace(',', '').match(/[\d\s]+/) || ['0']

    return parseInt(extractedNumber.replace(/\s/g, ''))
}

const parseCountryDateAndVolume = lang => coin => ({
    ...coin,
    country: convertCountryToISO(lang, coin[lang].country),
    date: dateConverter(coin[lang].date),
    volume: volumeConverter(coin[lang].volume)
})

const isVolume = str => str.includes("pièces") || str.includes("coins");

const fixDateAndVolumeInversion = (fixedDate) => {
    if (fixedDate) {
        // if we have a suggested date, we return a function which will fix the date
        return coin => isVolume(coin.fr.date) && !coin.fr.volume ? {
            ...coin,
            fr: {
                ...coin.fr,
                date: fixedDate,
                volume: coin.fr.date,
            }
        } : coin;
    }
    // else we return an meaningless function
    return coin => coin;
}

export const parseRemoteCoins = async (lang, sourceURL, fixedDate, collection) => {
    const { data } = await axios.get(sourceURL)

    const $ = cheerio.load(data);

    const tables = $('table.wikitable')

    return tables.map((_, el) => ({
        [lang]: {
            title: $(el).find(SELECTORS[lang].NAME_SELECTOR).text().split('[')[0],
            country: $(el).find(SELECTORS[lang].COUNTRY_SELECTOR).text(),
            date: $(el).find(SELECTORS[lang].DATE_SELECTOR).text(),
            volume: $(el).find(SELECTORS[lang].VOLUME_SELECTOR).text().split('[')[0],
        },
        image: $(el).find(SELECTORS[lang].IMAGE_SELECTOR).attr('src'),
        ...collection ? { collection } : {}
    }))
        .get()
        .map(fixDateAndVolumeInversion(fixedDate))
        .filter(coin => !!coin[lang].volume && !!coin[lang].date)
        .map(parseCountryDateAndVolume(lang))
}