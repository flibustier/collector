import { encode, decode } from "c8r";

import i18n from "../plugins/i18n";
import router from "../plugins/router";

const formatCollectionName = (index = 0) =>
  `${i18n.t(`owned`)}  ${index > 0 ? index + 1 : ""}`;

const redirectToPreviousCollection = id =>
  router.push({ name: "collection", params: { id: id - 1 } });

const addCollection = (
  { collections },
  { collection: owned = [], name } = {}
) =>
  collections.push({
    name: name || formatCollectionName(collections.length),
    owned
  });

const amountWithID = rootGetters => (amount, index) => ({
  id: rootGetters.coinList[index].id,
  amount
});

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

  exportCollection: (state, getters, rootState, rootGetters) => {
    const allAmounts = rootGetters.coinList.map(({ id }) =>
      getters.amountOwned(id)
    );

    while (allAmounts[allAmounts.length - 1] === 0) allAmounts.pop();

    return encode(allAmounts);
  },

  lastCollectionID: state => state.collections.length - 1,

  decodeExportedCollection: (
    state,
    getters,
    rootState,
    rootGetters
  ) => encodedData => {
    const amounts = decode(encodedData);

    return amounts
      .map(amountWithID(rootGetters))
      .filter(({ amount }) => amount > 0);
  }
};

const mutations = {
  setAmount(state, { collection, id, amount }) {
    const { owned } = collection;
    const existing = owned.find(coin => coin.id === id);
    if (existing) existing.amount = amount;
    else owned.push({ id, amount });
  },

  addCollection,

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

    redirectToPreviousCollection(state.collections.length);
  },

  deleteCollection({ commit, getters }) {
    const id = getters.currentCollectionID;
    commit("deleteCollection", { id });

    redirectToPreviousCollection(id);
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
