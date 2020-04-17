import i18n from "../plugins/i18n";
import database from "../assets/database.json";
import Coin from "../Coin";

const coins = database.coins.map(coin => new Coin(coin));
const coinYears = [...new Set(coins.map(coin => coin.year))];
const coinVolumes = [...new Set(coins.map(coin => coin.volume))];

const isCountryCodeAlreadyInList = (countryList, countryCode) =>
  countryList.filter(({ code }) => code === countryCode).length === 0;

const uniqueCountryList = (countryList, { country }) =>
  isCountryCodeAlreadyInList(countryList, country)
    ? [
        ...countryList,
        { code: country, translated: i18n.t(`countries.${country}`) }
      ]
    : countryList;

export default {
  getters: {
    databaseVersion: () => database.version,

    coinList: () => coins,

    numberOfExistingCoins: () => coins.length,

    minYear: () => Math.min(...coinYears),

    maxYear: () => Math.max(...coinYears),

    maxVolume: () => Math.max(...coinVolumes),

    allPossibleCountries: () =>
      coins
        .reduce(uniqueCountryList, [])
        .sort((a, b) => a.translated.localeCompare(b.translated))
  }
};
