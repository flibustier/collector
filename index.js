const axios = require('axios');
const cheerio = require('cheerio');

const WIKIPEDIA_URL = "https://fr.wikipedia.org/wiki/Pi%C3%A8ce_comm%C3%A9morative_de_2_euros"
const COUNTRY_SELECTOR = 'b span > a'

const run = async () => {
    const { data } = await axios.get(WIKIPEDIA_URL)

    const $ = cheerio.load(data);

    const tables = $('table.wikitable')

    const pieces = tables.map((_, el) => ({
          country: $(el).find(COUNTRY_SELECTOR).text() 
    })).get()

    console.log(pieces)
}

run()
