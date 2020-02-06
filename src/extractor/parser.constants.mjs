export const SELECTORS = {
  fr: {
    MAIN_SELECTOR: "table.wikitable",
    COUNTRY_SELECTOR: "b span > a",
    TITLE_SELECTOR:
      "tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > center:nth-child(1) > b:nth-child(1)",
    DATE_SELECTOR:
      "tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(2) > div:nth-child(1) > center:nth-child(1) > div:nth-child(4)",
    VOLUME_SELECTOR:
      "tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(2) > div:nth-child(1) > center:nth-child(1) > div:nth-child(6)",
    IMAGE_SELECTOR: "tbody tr td div.center div.floatnone a.image img"
  },
  en: {
    MAIN_SELECTOR: "table.wikitable > tbody > tr",
    COUNTRY_SELECTOR: "td:nth-child(2) > a",
    TITLE_SELECTOR: "td:nth-child(3)",
    DATE_SELECTOR: "td:nth-child(5)",
    VOLUME_SELECTOR: "td:nth-child(4)"
  }
};
