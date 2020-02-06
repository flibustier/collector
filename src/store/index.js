import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

import coinsModule from "./coins";
import settingsModule from "./settings";

Vue.use(Vuex);

const store = new Vuex.Store({
  plugins: [createPersistedState()],
  modules: {
    coins: coinsModule,
    settings: settingsModule
  }
});

export default store;
