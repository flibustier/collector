export const DATABASE_PATH = "src/assets/database.json";

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

export const POSSIBLE_ARGS = {
    WRITE_DB: "--write-database",
    DOWNLOAD: "--download",
    WITH_PANDA: "--tiny-png",
    DOWNLOAD_ALL: "--download-all",
    QUALITY: "--quality"
}

export const IMAGE_DIRECTORY = "public/images";
export const IMAGE_ALL_QUALITY = "all"
export const IMAGE_QUALITY = {
    MAXIMAL:    "fullsize",
    MEDIUM:     "medium",
    LOW:        "low"
}