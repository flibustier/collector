import { isEqual } from "lodash";

const coinMatchingFilters = (
  state,
  getters,
  rootState,
  rootGetters
) => coin => {
  const isOwned =
    !rootGetters.isCollection ||
    !rootState.settings.showOnlyOwned ||
    getters.amountOwned(coin.id) > 0;

  const isPassingCountry =
    state.countries.length === 0 || state.countries.includes(coin.country);

  const isWantedSeries =
    isNaN(coin.collection) || rootState.settings.series[coin.collection];

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
  countries: []
});

const state = {
  ...filters()
};

const getters = {
  isNotFiltered: state => isEqual(state, filters()),

  filteredCoins: (state, getters, rootState, rootGetters) =>
    rootGetters.coinList.filter(
      coinMatchingFilters(state, getters, rootState, rootGetters)
    ),

  numberOfDisplayedCoins: (state, getters) => getters.filteredCoins.length
};

const mutations = {
  reset(state) {
    Object.assign(state, filters());
  },

  setFilter(state, { name, value }) {
    state[name] = value;
  }
};

const actions = {
  resetFilters({ commit }) {
    commit("reset");
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
