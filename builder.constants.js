exports.IMAGE_DIRECTORY = "public/images/fullsize";
exports.DATABASE_PATH = "src/assets/database.json";
exports.DATABASE_VERSION = "2020-01-05";

//const WIKIPEDIA_URL = "http://localhost:8080/Pie%CC%80ce%20comme%CC%81morative%20de%202%20euros%20%E2%80%94%20Wikipe%CC%81dia.html"
exports.WIKIPEDIA_URL = "https://fr.wikipedia.org/wiki/S%C3%A9rie_de_pi%C3%A8ces_de_2_euros_du_50e_anniversaire_du_Trait%C3%A9_de_Rome"
exports.WIKIPEDIA_URLS = {
    fr: [
        {
            url: "https://fr.wikipedia.org/wiki/Pi%C3%A8ce_comm%C3%A9morative_de_2_euros"
        },
        {
            url: "https://fr.wikipedia.org/wiki/S%C3%A9rie_de_pi%C3%A8ces_de_2_euros_du_50e_anniversaire_du_Trait%C3%A9_de_Rome",
            fixDate: "25 mars 2007"
        },
        {
            url: "https://fr.wikipedia.org/wiki/S%C3%A9rie_de_pi%C3%A8ces_de_2_euros_du_10e_anniversaire_de_l%27Union_%C3%A9conomique_et_mon%C3%A9taire",
            fixDate: "1 janvier 2009"
        },
        {
            url: "https://fr.wikipedia.org/wiki/S%C3%A9rie_de_pi%C3%A8ces_de_2_euros_du_10e_anniversaire_de_l%27introduction_des_billets_et_des_pi%C3%A8ces_en_euro"
        },
        {
            url: "https://fr.wikipedia.org/wiki/S%C3%A9rie_de_pi%C3%A8ces_de_2_euros_du_30e_anniversaire_du_drapeau_europ%C3%A9en"
        }
    ]
};

exports.NAME_SELECTOR = 'tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > center:nth-child(1) > b:nth-child(1)'
exports.COUNTRY_SELECTOR = 'b span > a'
exports.DATE_SELECTOR = "tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(2) > div:nth-child(1) > center:nth-child(1) > div:nth-child(4)"
exports.VOLUME_SELECTOR = "tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(2) > div:nth-child(1) > center:nth-child(1) > div:nth-child(6)"
exports.IMAGE_SELECTOR = "tbody tr td div.center div.floatnone a.image img"

exports.POSSIBLE_ARGS = {
    FIX_DATE: '--fix-date'
}

exports.ISO_3166_1_ALPHA_2 = {
    'Allemagne': 'DE',
    'Andorre': 'AD',
    'Autriche': 'AT',
    'Belgique': 'BE',
    'Chypre': 'CY',
    'Espagne': 'ES',
    'Estonie': 'EE',
    'Finlande': 'FI',
    'France': 'FR',
    'Grèce': 'GR',
    'Irlande': 'IE',
    'Italie': 'IT',
    'Lettonie': 'LV',
    'Lituanie': 'LT',
    'Luxembourg': 'LU',
    'Malte': 'MT',
    'Monaco': 'MC',
    'Pays-Bas': 'NL',
    'Portugal': 'PT',
    'Saint-Marin': 'SM',
    'Slovaquie': 'SK',
    'Slovénie': 'SI',
    'Vatican': 'VA',
}