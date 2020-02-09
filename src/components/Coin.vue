<template>
  <div :class="`card ${cardClass}`">
    <div class="card-content">
      <div class="header">
        <div class="is-flex">
          <span :class="`flag-icon ${coin.countryFlag}`"></span>
          <span class="subtitle is-6 country">
            {{ $t(`countries.${coin.country}`) }}
          </span>
        </div>
        <p class="subtitle is-6">{{ coinInLocale.date }}</p>
      </div>

      <figure class="image">
        <img
          v-if="imageForCurrentQuality"
          :src="imageForCurrentQuality"
          @click="showFullSizeImage"
        />
        <div class="image-placeholder" v-else />
      </figure>

      <div class="content has-text-centered">
        <p class="title is-6">{{ coinInLocale.title }}</p>
      </div>

      <div class="has-text-centered">
        <p class="subtitle is-6">{{ coinInLocale.volume }} - {{ coin.id }}</p>
      </div>
    </div>
    <div class="card-footer" v-if="!dontShowFooter">
      <div class="card-footer-item">
        <b-numberinput
          size="is-small"
          min="0"
          controls-position="compact"
          controls-rounded
          :value="amountOwned"
          @input="amount => $store.commit('setAmount', { id: coin.id, amount })"
        ></b-numberinput>
      </div>
      <div class="card-footer-item">
        <b-icon icon="chart-bar" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

import ImageModal from "./ImageModal";

import { ROOT_LANGUAGE } from "../constants.mjs";

export default {
  props: {
    coin: Object
  },

  computed: {
    imageForCurrentQuality() {
      return this.coin.image(this.currentQuality);
    },

    coinInLocale() {
      return this.coin[this.$i18n.locale] || this.coin[ROOT_LANGUAGE];
    },

    cardClass() {
      if (this.amountOwned > 0) return "is-owned";
      if (this.displayRarity) return `is-not-owned-${this.coin.rarity}`;

      return "is-not-owned-common";
    },

    amountOwned() {
      return this.$store.getters.amountOwned(this.coin.id);
    },

    ...mapState({
      currentQuality: state => state.settings.quality,
      dontShowFooter: state => state.settings.displayOnly,
      displayRarity: state => state.settings.displayRarity
    })
  },

  methods: {
    showFullSizeImage() {
      this.$buefy.modal.open({
        parent: this,
        component: ImageModal,
        props: {
          imgSrc: this.coin.image()
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
}

.country {
  margin-left: 0.5rem;
  margin-right: 0.5rem;
}

.image {
  margin: auto;
  margin-top: 1rem;
  margin-bottom: 1rem;
  height: 200px;
  width: 200px;
}

.image-placeholder {
  border: 3px dotted;
  height: 100%;
  border-radius: 200px;
}

.card {
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 18px;
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.is-not-owned-common:hover {
  box-shadow: 0 1px 6px 0 rgba(32, 33, 36, 0.28);
}
.is-not-owned-uncommon:hover {
  box-shadow: 0 1px 6px 0 #21bf73;
}
.is-not-owned-rare:hover {
  box-shadow: 0 1px 6px 0 #0070dd;
}
.is-not-owned-epic:hover {
  box-shadow: 0 1px 6px 0 #a335ee;
}
.is-not-owned-legendary:hover {
  box-shadow: 0 1px 6px 0 #ff8000;
}

.is-owned {
  box-shadow: inset 0 1px 6px 0 rgba(32, 33, 36, 0.28);
}

.is-rare:hover {
  border: rgba(13, 50, 141, 0.3) solid 2px;
}
</style>
