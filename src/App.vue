<template>
  <div id="app">
    <nav-bar />
    <div class="columns">
      <div class="column is-one-quarter-tablet is-one-fifth-desktop">
        <filters />
      </div>
      <div class="column">
        <coin-list />
      </div>
    </div>
  </div>
</template>

<script>
import CoinList from "./components/CoinList.vue";
import Filters from "./components/Filters.vue";
import NavBar from "./components/NavBar";

export default {
  name: "app",

  components: {
    CoinList,
    Filters,
    NavBar
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
