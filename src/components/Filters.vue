<template>
  <aside>
    <div class="header">
      <h1>
        {{ numberOfDisplayedCoins }}/{{ numberOfExistingCoins }}
        {{ $t("displayed") }}
      </h1>

      <r-button
        is-info
        is-small
        :disabled="isNotFiltered"
        @click="reset"
        icon="undo"
        :text="$t('reset')"
      />
    </div>

    <section class="field" v-if="isCollection">
      <b-switch
        size="is-small"
        :value="showOnlyOwned"
        @input="value => setFilter({ name: 'showOnlyOwned', value })"
        >{{ $t(`showOnlyOwned`) }}</b-switch
      >
    </section>

    <section class="field">
      <b-field :label="$t('years')">
        <b-slider
          :value="selectedYears"
          :min="minYear"
          :max="maxYear"
          :step="1"
          size="is-small"
          @input="value => setFilter({ name: 'years', value })"
          ticks
          rounded
          class="years-slider"
        ></b-slider>
      </b-field>
    </section>

    <b-collapse
      class="card"
      animation="slide"
      :open="collapse['countries']"
      @update:open="value => setCollapse({ index: 'countries', value })"
    >
      <div slot="trigger" slot-scope="props" class="card-header" role="button">
        <p class="card-header-title">{{ $t("countries") }}</p>
        <a class="card-header-icon">
          <b-icon :icon="props.open ? 'angle-up' : 'angle-down'"></b-icon>
        </a>
      </div>
      <b-select
        multiple
        native-size="8"
        :value="selectedCountries"
        @input="countries => setFilter({ name: 'countries', value: countries })"
        expanded
      >
        <option
          v-for="{ code, translated } in allPossibleCountries"
          :key="code"
          :value="code"
        >
          <span :class="`flag-icon flag-icon-${code.toLowerCase()}`"></span>
          {{ translated }}
        </option>
      </b-select>
    </b-collapse>

    <b-collapse
      class="card"
      animation="slide"
      v-if="displayRarity"
      :open="collapse['rarity']"
      @update:open="value => setCollapse({ index: 'rarity', value })"
    >
      <div slot="trigger" slot-scope="props" class="card-header" role="button">
        <p class="card-header-title">{{ $t("rarity") }}</p>
        <a class="card-header-icon">
          <b-icon :icon="props.open ? 'angle-up' : 'angle-down'"></b-icon>
        </a>
      </div>
      <div class="card-content">
        <div
          class="field"
          v-for="(color, index) in [
            'is-dark',
            'is-dark',
            'is-uncommon',
            'is-rare',
            'is-epic',
            'is-legendary'
          ]"
          :key="index"
        >
          <b-radio
            v-model="rarity"
            size="is-small"
            :type="color"
            :native-value="index"
            >{{ $t(`rarityLevels[${index}]`) }}</b-radio
          >
        </div>
      </div>
    </b-collapse>

    <b-collapse
      class="card"
      animation="slide"
      :open="collapse['series']"
      @update:open="value => setCollapse({ index: 'series', value })"
    >
      <div slot="trigger" slot-scope="props" class="card-header" role="button">
        <p class="card-header-title">Séries</p>
        <a class="card-header-icon">
          <b-icon :icon="props.open ? 'angle-up' : 'angle-down'"></b-icon>
        </a>
      </div>
      <div class="card-content">
        <b-field v-for="index in [0, 1, 2, 3]" :key="index">
          <b-switch
            size="is-small"
            :value="series[index]"
            @input="value => setSeriesSwitch({ index, value })"
            >{{ $t(`collections[${index}]`) }}</b-switch
          >
        </b-field>
      </div>
    </b-collapse>
  </aside>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";

import RButton from "./atoms/Button";

import {
  UNCOMMON_CAP,
  RARE_CAP,
  EPIC_CAP,
  LEGENDARY_CAP
} from "../constants.mjs";

export default {
  components: {
    RButton
  },

  data() {
    return {
      rarity: 0
    };
  },

  watch: {
    rarity: {
      handler() {
        this.setFilter({ name: "volumes", value: this.rarityToVolumeRange });
      },
      immediate: true
    }
  },

  computed: {
    ...mapGetters([
      "isNotFiltered",
      "maxVolume",
      "minYear",
      "maxYear",
      "numberOfDisplayedCoins",
      "numberOfExistingCoins",
      "allPossibleCountries",
      "isCollection"
    ]),

    ...mapState({
      selectedCountries: state => state.filters.countries,
      selectedYears: state => state.filters.years,
      displayRarity: state => state.settings.displayRarity,
      showOnlyOwned: state => state.filters.showOnlyOwned,
      series: state => state.filters.series,
      collapse: state => state.settings.collapse
    }),

    rarityToVolumeRange() {
      switch (this.rarity) {
        case 1:
          return [UNCOMMON_CAP, this.maxVolume];
        case 2:
          return [RARE_CAP, UNCOMMON_CAP];
        case 3:
          return [EPIC_CAP, RARE_CAP];
        case 4:
          return [LEGENDARY_CAP, EPIC_CAP];
        case 5:
          return [0, LEGENDARY_CAP];
        default:
          return [0, this.maxVolume];
      }
    }
  },

  methods: {
    ...mapMutations(["setFilter", "setSeriesSwitch", "setCollapse"]),

    reset() {
      this.$store.commit("reset");
      this.rarity = 0;
    }
  }
};
</script>

<style scoped>
aside {
  margin: 15px 1rem 1.5rem 10px;
}

.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.years-slider {
  padding-right: 10px;
  padding-left: 10px;
}
</style>

<i18n>
{
  "en": {
    "displayed": "coins displayed",
    "reset": "Reset",
    "countries": "Countries",
    "years": "Years",
    "rarity": "Rarity",
    "rarityLevels": [
      "All", "Common", "Uncommon", "Rare", "Epic", "Legendary"
    ],
    "showOnlyOwned": "Display only owned coins"
  },
  "fr": {
    "displayed": "pieces affichees",
    "reset": "Réinitialiser",
    "countries": "Pays",
    "years": "Années",
    "rarity": "Rareté",
    "rarityLevels": [
      "Toutes", "Comune", "Inhabituelle", "Rare", "Épique", "Légendaire"
    ],
    "showOnlyOwned": "Afficher uniquement les pièces possédées"
  }
}
</i18n>
