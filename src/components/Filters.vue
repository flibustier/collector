<template>
  <aside>
    <div class="header">
      <p class="subtitle is-6">
        {{ $t("displayed") }}: {{ numberOfCoinsDisplayed }}
      </p>

      <b-button
        type="is-info"
        size="is-small"
        :disabled="isNotFiltered"
        @click="reset"
        icon-left="undo"
        outlined
        rounded
        >{{ $t("reset") }}</b-button
      >
    </div>

    <section class="field">
      <b-field :label="$t('years')">
        <b-slider
          :value="selectedYears"
          :min="minYear"
          :max="maxYear"
          :step="1"
          size="is-small"
          @input="years => $store.commit('setYearsRange', years)"
          ticks
          rounded
        ></b-slider>
      </b-field>
    </section>

    <section class="field">
      <b-field :label="$t('countries')">
        <b-select
          multiple
          native-size="8"
          :value="selectedCountries"
          @input="countries => $store.commit('setCountryList', countries)"
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
      </b-field>
    </section>

    <section class="field">
      <b-field :label="$t('rarity')"></b-field>

      <div
        class="field"
        v-for="(color, index) in [
          'is-dark',
          'is-dark',
          'is-success',
          'is-info',
          'is-primary',
          'is-warning'
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
    </section>

    <section class="field">
      <b-field label="Séries"></b-field>

      <b-field v-for="index in [0, 1, 2, 3]" :key="index">
        <b-switch
          size="is-small"
          :value="$store.state.coins.filters.collections[index]"
          @input="value => $store.commit('switchCollection', { index, value })"
        >
          {{ $t(`collections[${index}]`) }}
        </b-switch>
      </b-field>
    </section>
  </aside>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  data() {
    return {
      rarity: 0
    };
  },

  watch: {
    rarity: {
      handler() {
        this.$store.commit("setVolumesRange", this.rarityToVolumeRange);
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
      "numberOfCoinsDisplayed",
      "allPossibleCountries"
    ]),

    ...mapState({
      selectedCountries: state => state.coins.filters.list.countries,
      selectedYears: state => state.coins.filters.range.years
    }),

    rarityToVolumeRange() {
      const [UNCOMMON_CAP, RARE_CAP, EPIC_CAP, LEGENDARY_CAP] = [
        10000000,
        2000000,
        1000000,
        200000
      ];

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
    reset() {
      this.$store.commit("reset");
      this.rarity = 0;
    }
  }
};
</script>

<style scoped>
aside {
  margin-top: 15px;
  margin-left: 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
}
</style>

<i18n>
{
  "en": {
    "displayed": "Coins displayed",
    "reset": "Reset",
    "countries": "Countries",
    "years": "Years",
    "rarity": "Rarity",
    "rarityLevels": [
      "All", "Common", "Uncommon", "Rare", "Epic", "Legendary"
    ]
  },
  "fr": {
    "displayed": "Nombre de pièces affichées",
    "reset": "Réinitialiser",
    "countries": "Pays",
    "years": "Années",
    "rarity": "Rareté",
    "rarityLevels": [
      "Toutes", "Comune", "Inhabituelle", "Rare", "Épique", "Légendaire"
    ]
  }
}
</i18n>
