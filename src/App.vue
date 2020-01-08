<template>
  <div id="app">
    <nav-bar :searchInput.sync="searchInput" />
    <div class="columns">
      <div class="column is-one-fifth">
        <filters
          :coinsNumber="filteredCoins.length"
          :minYear="minYear"
          :maxYear="maxYear"
          :countryList="countryList"
          :years.sync="selectedYears"
          :countries.sync="selectedCountries"
          :volumes.sync="selectedVolumes"
          :maxVolume="maxVolume"
        />
      </div>
      <div class="column">
        <coin-list :coins="filteredCoins" />
      </div>
    </div>
  </div>
</template>

<script>
import database from "./assets/database.json";

import CoinList from "./components/CoinList.vue";
import Filters from "./components/Filters.vue";
import NavBar from "./components/NavBar";

export default {
  name: "app",

  components: {
    CoinList,
    Filters,
    NavBar
  },

  data() {
    return {
      selectedYears: [],
      selectedCountries: [],
      selectedVolumes: [],
      searchInput: ""
    };
  },

  computed: {
    coins() {
      return database.coins.map(coin => ({
        ...coin,
        date: new Date(coin.date),
        year: new Date(coin.date).getFullYear()
      }));
    },

    filteredCoins() {
      return this.coins.filter(
        coin =>
          (this.selectedCountries.length === 0 ||
            this.selectedCountries.includes(coin.country.toLowerCase())) &&
          coin.year >= this.selectedYears[0] &&
          coin.year <= this.selectedYears[1] &&
          coin.volume >= this.selectedVolumes[0] &&
          coin.volume <= this.selectedVolumes[1] &&
          (coin.fr.title
            .toLowerCase()
            .includes(this.searchInput.toLowerCase()) ||
            coin.id.toLowerCase().includes(this.searchInput.toLowerCase()))
      );
    },

    coinYears() {
      return this.coins.map(coin => coin.year);
    },

    minYear() {
      return Math.min(...this.coinYears);
    },

    maxYear() {
      return Math.max(...this.coinYears);
    },

    maxVolume() {
      return Math.max(...this.coins.map(coin => coin.volume));
    },

    countryList() {
      return this.coins
        .reduce(function(countryList, coin) {
          if (
            countryList.filter(
              country => country === coin.country
            ).length === 0
          )
            return [...countryList, coin.country];
          else return countryList;
        }, [])
    }
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
