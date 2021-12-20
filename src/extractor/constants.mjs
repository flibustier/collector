export const DATABASE_PATH = "src/assets/database.json";

const from2004 = [
  2004,
  2005,
  2006,
  2007,
  2008,
  2009,
  2010,
  2011,
  2012,
  2013,
  2014,
  2015,
  2016,
  2017,
  2018,
  2019,
  2020,
  2021,
  2022
];

export const WIKIPEDIA_URLS = {
  fr: [
    ...from2004.map(year => ({
      url: `https://fr.wikipedia.org/wiki/Liste_des_pi%C3%A8ces_comm%C3%A9moratives_de_2_euros_de_${year}`
    })),
    {
      url:
        "https://fr.wikipedia.org/wiki/S%C3%A9rie_de_pi%C3%A8ces_de_2_euros_du_50e_anniversaire_du_Trait%C3%A9_de_Rome",
      fixDate: "25 mars 2007",
      collection: 0
    },
    {
      url:
        "https://fr.wikipedia.org/wiki/S%C3%A9rie_de_pi%C3%A8ces_de_2_euros_du_10e_anniversaire_de_l%27Union_%C3%A9conomique_et_mon%C3%A9taire",
      fixDate: "1 janvier 2009",
      collection: 1
    },
    {
      url:
        "https://fr.wikipedia.org/wiki/S%C3%A9rie_de_pi%C3%A8ces_de_2_euros_du_10e_anniversaire_de_l%27introduction_des_billets_et_des_pi%C3%A8ces_en_euro",
      collection: 2
    },
    {
      url:
        "https://fr.wikipedia.org/wiki/S%C3%A9rie_de_pi%C3%A8ces_de_2_euros_du_30e_anniversaire_du_drapeau_europ%C3%A9en",
      collection: 3
    }
  ],
  en: [
    {
      url: "https://en.wikipedia.org/wiki/2_euro_commemorative_coins"
    }
  ]
};

export const IMAGE_DIRECTORY = "public/images";
export const IMAGE_ALL_QUALITIES = "all";
