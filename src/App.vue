<template>
  <div id="app">
    <nav-bar />
    <div class="columns">
      <div class="column is-one-quarter-tablet is-one-fifth-desktop">
        <filters />
      </div>
      <div class="column">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import Actions from "./components/Actions.vue";
import CoinList from "./components/CoinList.vue";
import Filters from "./components/Filters.vue";
import NavBar from "./components/NavBar";

export default {
  name: "app",

  components: {
    Actions,
    CoinList,
    Filters,
    NavBar
  },

  mounted() {
    this.$store.dispatch("fetchDatabase");
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
