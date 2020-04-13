import i18n from "../plugins/i18n";
import Coin from "../Coin";

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
  state: {
    coins: []
  },

  getters: {
    coinList: state => state.coins,

    numberOfExistingCoins: (state, getters) => getters.coinList.length,

    isFetching: (state, getters) => !getters.numberOfExistingCoins,

    coinYears: (state, getters) => [
      ...new Set(getters.coinList.map(coin => coin.year))
    ],

    coinVolumes: (state, getters) => [
      ...new Set(getters.coinList.map(coin => coin.volume))
    ],

    minYear: (state, getters) =>
      getters.isFetching ? 0 : Math.min(...getters.coinYears),

    maxYear: (state, getters) =>
      getters.isFetching ? 0 : Math.max(...getters.coinYears),

    maxVolume: (state, getters) =>
      getters.isFetching ? 0 : Math.max(...getters.coinVolumes),

    allPossibleCountries: (state, getters) =>
      getters.coinList
        .reduce(uniqueCountryList, [])
        .sort((a, b) => a.translated.localeCompare(b.translated))
  },

  mutations: {
    updateCoinList(state, coinList) {
      state.coins = coinList.map(coin => new Coin(coin));
    }
  },

  actions: {
    fetchDatabase: async ({ commit, dispatch }) => {
      const response = await fetch("database.json");
      const database = await response.json();

      commit("updateCoinList", database.coins);
      dispatch("resetFilters");
    }
  }
};
