import { encode } from "c8r";

import i18n from "../plugins/i18n";
import router from "../plugins/router";

const formatCollectionName = (index = 0) =>
  `${i18n.t(`owned`)}  ${index > 0 ? index + 1 : ""}`;

const state = {
  collections: [
    {
      name: formatCollectionName(),
      owned: []
    }
  ]
};

const getters = {
  currentCollectionID: (state, getters, rootState) =>
    rootState.route.params.id % state.collections.length || 0,

  currentCollection: (state, getters) =>
    state.collections[getters.currentCollectionID],

  currentCollectionName: (state, getters) => getters.currentCollection.name,

  collectionsNames: state => state.collections.map(({ name }) => name),

  numberOfOwnedCoins: (state, getters) =>
    getters.currentCollection.owned.reduce(
      (sum, { amount }) => sum + amount,
      0
    ),

  amountOwned: (state, getters) => id =>
    getters.currentCollection.owned.find(coin => coin.id === id)?.amount || 0,

  exportOwned: (state, getters, rootState, rootGetters) => {
    const allAmounts = rootGetters.coinList.map(({ id }) =>
      getters.amountOwned(id)
    );

    while (allAmounts[allAmounts.length - 1] === 0) allAmounts.pop();

    return {
      allAmounts,
      test: encode(allAmounts)
    };
  }
};

const mutations = {
  setAmount(state, { collection, id, amount }) {
    const { owned } = collection;
    const existing = owned.find(coin => coin.id === id);
    if (existing) existing.amount = amount;
    else owned.push({ id, amount });
  },

  addCollection(state) {
    state.collections.push({
      name: formatCollectionName(state.collections.length),
      owned: []
    });
  },

  setCollectionName(state, { collection, name }) {
    collection.name = name;
  },

  deleteCollection(state, { id }) {
    state.collections.splice(id, 1);
  }
};

const mutationWithCollection = mutation => ({ commit, getters }, params) =>
  commit(mutation, { collection: getters.currentCollection, ...params });

const actions = {
  createCollection({ commit, state }) {
    commit("addCollection");

    router.push({
      name: "collection",
      params: { id: state.collections.length - 1 }
    });
  },

  deleteCollection({ commit, getters }) {
    const id = getters.currentCollectionID;
    commit("deleteCollection", { id });

    router.push({ name: "collection", params: { id: id - 1 } });
  },

  setAmount: mutationWithCollection("setAmount"),

  setCollectionName: mutationWithCollection("setCollectionName")
};

export default {
  state,
  getters,
  mutations,
  actions
};
