import { isEqual } from "lodash";

const coinMatchingFilters = (state, getters, rootGetters) => coin => {
  const isOwned =
    !rootGetters.isCollection ||
    !state.showOnlyOwned ||
    getters.amountOwned(coin.id) > 0;

  const isPassingCountry =
    state.countries.length === 0 || state.countries.includes(coin.country);

  const isWantedSeries =
    isNaN(coin.collection) || state.series[coin.collection];

  return (
    isOwned &&
    isPassingCountry &&
    isWantedSeries &&
    coin.isInYearRange(...(state.years || [])) &&
    coin.isInVolumeRange(...(state.volumes || [])) &&
    coin.isMatchingSearchString(state.searchInput.toLowerCase())
  );
};

const filters = () => ({
  searchInput: "",
  years: [],
  volumes: [],
  countries: [],
  series: {
    0: true,
    1: true,
    2: true,
    3: true
  },
  showOnlyOwned: false
});

const state = {
  ...filters()
};

const getters = {
  isNotFiltered: state => isEqual(state, filters()),

  filteredCoins: (state, getters, rootState, rootGetters) =>
    rootGetters.coinList.filter(
      coinMatchingFilters(state, getters, rootGetters)
    ),

  numberOfDisplayedCoins: (state, getters) => getters.filteredCoins.length
};

const mutations = {
  reset(state) {
    Object.assign(state, filters());
  },

  setFilter(state, { name, value }) {
    state[name] = value;
  },

  setSeriesSwitch(state, { index, value }) {
    state.series[index] = value;
  }
};

export default {
  state,
  mutations,
  getters
};
