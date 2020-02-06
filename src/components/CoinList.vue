<template>
  <div class="container">
    <div class="notification">
      <div class="columns is-multiline">
        <div
          v-for="coin in filteredCoins"
          :key="coin.id"
          class="column is-half is-one-third-desktop is-one-quarter-fullhd"
        >
          <coin :coin="coin" />
        </div>
      </div>
    </div>
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
    },
  }
};
</script>
