<template>
  <div class="container">
    <div class="notification columns is-multiline" v-if="filteredCoins.length">
      <div
        v-for="coin in filteredCoins"
        :key="coin.id"
        class="column is-half is-one-third-desktop is-one-quarter-fullhd"
      >
        <coin :coin="coin" />
      </div>
    </div>

    <section class="hero" v-else>
      <div class="hero-body has-text-centered">
        <div class="container">
          <h1 class="title">
            <b-icon icon="frown-open" />
          </h1>
          <h2 class="subtitle">{{ $t('empty') }}</h2>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Coin from "./Coin";

export default {
  components: {
    Coin
  },

  computed: {
    filteredCoins() {
      return this.$store.getters.filteredCoins;
    }
  }
};
</script>

<style scoped>
.hero {
  margin-top: 25vh;
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
