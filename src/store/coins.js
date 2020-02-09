import { isEqual } from "lodash";
import i18n from "../plugins/i18n";
import database from "../assets/database.json";
import Coin from "../Coin";

const coins = database.coins.map(coin => new Coin(coin));
const coinYears = [...new Set(coins.map(coin => coin.year))];
const coinVolumes = [...new Set(coins.map(coin => coin.volume))];

const filters = () => ({
  searchInput: "",
  range: {
    years: [],
    volumes: []
  },
  list: {
    countries: []
  },
  collections: {
    0: true,
    1: true,
    2: true,
    3: true
  }
});

export default {
  state: {
    filters: filters(),
    owned: []
  },

  mutations: {
    reset(state) {
      state.filters = filters();
    },

    setYearsRange({ filters }, newRange) {
      filters.range.years = newRange;
    },

    setVolumesRange({ filters }, newRange) {
      filters.range.volumes = newRange;
    },

    setCountryList({ filters }, newList) {
      filters.list.countries = newList;
    },

    setSearchInput({ filters }, input) {
      filters.searchInput = input;
    },

    switchCollection({ filters }, { index, value }) {
      filters.collections[index] = value;
    },

    setAmount({ owned }, { id, amount }) {
      const existing = owned.find(coin => coin.id === id);
      if (existing) existing.amount = amount;
      else owned.push({ id, amount });
    }
  },

  getters: {
    isNotFiltered: state => isEqual(state.filters, filters()),

    filteredCoins: ({ filters }, getters, rootState) =>
      coins.filter(
        coin =>
          (!rootState.settings.showOnlyOwned ||
            getters.amountOwned(coin.id) > 0) &&
          (filters.list.countries.length === 0 ||
            filters.list.countries.includes(coin.country)) &&
          coin.isInYearRange(...(filters.range.years || [])) &&
          coin.isInVolumeRange(...(filters.range.volumes || [])) &&
          (isNaN(coin.collection) || filters.collections[coin.collection]) &&
          coin.isMatchingSearchString(filters.searchInput.toLowerCase())
      ),

    numberOfCoinsDisplayed: (state, getters) => getters.filteredCoins.length,

    amountOwned: ({ owned }) => id =>
      owned.find(coin => coin.id === id)?.amount || 0,

    minYear: () => Math.min(...coinYears),

    maxYear: () => Math.max(...coinYears),

    maxVolume: () => Math.max(...coinVolumes),

    allPossibleCountries: () =>
      coins
        .reduce((countryList, { country }) => {
          const countryNotAlreadyInList =
            countryList.filter(({ code }) => code === country).length === 0;

          if (countryNotAlreadyInList) {
            return [
              ...countryList,
              { code: country, translated: i18n.t(`countries.${country}`) }
            ];
          }
          return countryList;
        }, [])
        .sort((a, b) => a.translated.localeCompare(b.translated))
  }
};
