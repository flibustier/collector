import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

import coins from "./coins";
import collections from "./collections";
import filters from "./filters";
import settings from "./settings";

Vue.use(Vuex);

const store = new Vuex.Store({
  plugins: [
    createPersistedState({
      paths: ["collections", "settings"]
    })
  ],
  modules: {
    coins,
    collections,
    filters,
    settings
  },
  getters: {
    isCollection: (state, getters, rootState) =>
      rootState.route.path.includes("/collection")
  }
});

export default store;
