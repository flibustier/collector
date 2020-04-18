import { IMAGE_QUALITY } from "../constants.mjs";

export default {
  state: {
    quality: IMAGE_QUALITY.LOW,
    displayRarity: false,
    displayID: false,
    showOnlyOwned: false,
    collapse: {
      countries: true,
      rarity: true,
      series: true
    },
    series: {
      0: true,
      1: true,
      2: true,
      3: true
    }
  },

  mutations: {
    setQuality(state, quality) {
      if (Object.values(IMAGE_QUALITY).includes(quality)) {
        state.quality = quality;
      }
    },

    setBoolean(state, { name, value }) {
      state[name] = value;
    },

    setCollapse(state, { index, value }) {
      state.collapse[index] = value;
    },

    setSeriesSwitch(state, { index, value }) {
      state.series[index] = value;
    }
  },

  getters: {}
};
