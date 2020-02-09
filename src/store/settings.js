import { IMAGE_QUALITY } from "../constants.mjs";

export default {
  state: {
    quality: IMAGE_QUALITY.LOW,
    showOnlyOwned: false,
    displayOnly: false
  },

  mutations: {
    setQuality(state, quality) {
      if (Object.values(IMAGE_QUALITY).includes(quality)) {
        state.quality = quality;
      }
    },

    setBoolean(state, { name, value }) {
      state[name] = value;
    }
  },

  getters: {}
};
