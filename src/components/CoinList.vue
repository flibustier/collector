<template>
  <div class="container">
    <div class="columns is-multiline" v-if="filteredCoins.length">
      <div
        v-for="coin in displayedCoins"
        :key="coin.id"
        class="column is-half is-one-third-desktop is-one-quarter-fullhd"
      >
        <coin :coin="coin" />
      </div>
    </div>

    <section class="hero" v-else>
      <div class="hero-body has-text-centered">
        <div class="container" v-if="!isFetching">
          <h1 class="title">
            <b-icon icon="frown-open" />
          </h1>
          <h2 class="subtitle">{{ $t("empty") }}</h2>
        </div>
        <logo class="logo" active v-else />
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Coin from "./Coin";
import Logo from "./atoms/Logo";

const NUMBER_OF_COINS_DISPLAY_AT_EACH_SCROLL = 12;

export default {
  components: {
    Coin,
    Logo
  },

  data() {
    return {
      displayedCoins: []
    };
  },

  watch: {
    filteredCoins() {
      this.displayedCoins = [];
      this.loadCoinsToDisplay();
    }
  },

  computed: {
    ...mapGetters(["isFetching", "filteredCoins"])
  },

  methods: {
    loadCoinsToDisplay() {
      const currentlyDisplayed = this.displayedCoins.length;
      const maximumCoinsToDisplay = this.filteredCoins.length;

      if (currentlyDisplayed < maximumCoinsToDisplay) {
        const endIndex = Math.min(
          currentlyDisplayed + NUMBER_OF_COINS_DISPLAY_AT_EACH_SCROLL,
          maximumCoinsToDisplay
        );

        this.displayedCoins.push(
          ...this.filteredCoins.slice(currentlyDisplayed, endIndex)
        );
      }
    }
  },

  mounted() {
    this.loadCoinsToDisplay();
    window.onscroll = () => {
      let bottomOfWindow =
        document.documentElement.scrollTop + window.innerHeight >=
        document.documentElement.offsetHeight * 0.95;

      if (bottomOfWindow) {
        this.loadCoinsToDisplay();
      }
    };
  }
};
</script>

<style scoped>
.container {
  padding: 1.25rem 2.5rem 1.25rem 1.5rem;
}

.hero {
  margin-top: 25vh;
}

.logo {
  width: 5rem;
  height: 5rem;
}
</style>

<i18n>
{
  "en": {
    "empty": "No coins found with these criterias..."
  },
  "fr": {
    "empty": "Aucune pièce n’a été trouvée avec ces critères…"
  }
}
</i18n>
