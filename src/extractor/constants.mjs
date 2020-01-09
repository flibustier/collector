export const IMAGE_DIRECTORY = "public/images/fullsize";
export const DATABASE_PATH = "src/assets/database.json";
export const DATABASE_VERSION = "2020-01-05";

//const WIKIPEDIA_URL = "http://localhost:8080/Pie%CC%80ce%20comme%CC%81morative%20de%202%20euros%20%E2%80%94%20Wikipe%CC%81dia.html"
export const WIKIPEDIA_URL = "https://fr.wikipedia.org/wiki/S%C3%A9rie_de_pi%C3%A8ces_de_2_euros_du_50e_anniversaire_du_Trait%C3%A9_de_Rome"
export const WIKIPEDIA_URLS = {
    fr: [
        {
            url: "https://fr.wikipedia.org/wiki/Pi%C3%A8ce_comm%C3%A9morative_de_2_euros"
        },
        {
            url: "https://fr.wikipedia.org/wiki/S%C3%A9rie_de_pi%C3%A8ces_de_2_euros_du_50e_anniversaire_du_Trait%C3%A9_de_Rome",
            fixDate: "25 mars 2007",
            collection: "Treaty of Rome"
        },
        {
            url: "https://fr.wikipedia.org/wiki/S%C3%A9rie_de_pi%C3%A8ces_de_2_euros_du_10e_anniversaire_de_l%27Union_%C3%A9conomique_et_mon%C3%A9taire",
            fixDate: "1 janvier 2009",
            collection: "Economic and Monetary Union"
        },
        {
            url: "https://fr.wikipedia.org/wiki/S%C3%A9rie_de_pi%C3%A8ces_de_2_euros_du_10e_anniversaire_de_l%27introduction_des_billets_et_des_pi%C3%A8ces_en_euro",
            collection: "Euro coins and banknotes"
        },
        {
            url: "https://fr.wikipedia.org/wiki/S%C3%A9rie_de_pi%C3%A8ces_de_2_euros_du_30e_anniversaire_du_drapeau_europ%C3%A9en",
            collection: "Flag of Europe"
        }
    ]
};

export const NAME_SELECTOR = 'tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > center:nth-child(1) > b:nth-child(1)'
export const COUNTRY_SELECTOR = 'b span > a'
export const DATE_SELECTOR = "tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(2) > div:nth-child(1) > center:nth-child(1) > div:nth-child(4)"
export const VOLUME_SELECTOR = "tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(2) > div:nth-child(1) > center:nth-child(1) > div:nth-child(6)"
export const IMAGE_SELECTOR = "tbody tr td div.center div.floatnone a.image img"

export const POSSIBLE_ARGS = {
    FIX_DATE: '--fix-date'
}

export const ISO_3166_1_ALPHA_2 = {
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