<template>
  <aside>
    <div class="header">
      <p class="subtitle is-6">{{ $t('displayed') }}: {{ coinsNumber }}</p>

      <b-button
        type="is-info"
        size="is-small"
        :disabled="!isFiltered"
        @click="reset"
        icon-left="undo"
        outlined
        rounded
      >{{ $t('reset') }}</b-button>
    </div>

    <b-field :label="$t('countries')">
      <b-select
        multiple
        native-size="12"
        :value="countries"
        @input="countries => $emit('update:countries', countries)"
        expanded
      >
        <option v-for="country in countryList" :key="country" :value="country">
          <span :class="`flag-icon flag-icon-${country.toLowerCase()}`"></span>
          {{ $t(`countries.${country}`) }}
        </option>
      </b-select>
    </b-field>

    <b-field :label="$t('years')">
      <b-slider
        :value="years"
        :min="minYear"
        :max="maxYear"
        :step="1"
        size="is-small"
        @input="years => $emit('update:years', years)"
        ticks
        rounded
      ></b-slider>
    </b-field>

    <b-field :label="$t('rarity')">
      <b-slider class="rarity" v-model="rarity" :min="0" :max="4" :tooltip="false" rounded>
        <b-slider-tick :value="0">Common</b-slider-tick>
        <b-slider-tick :value="1">Uncommon</b-slider-tick>
        <b-slider-tick :value="2">Rare</b-slider-tick>
        <b-slider-tick :value="3">Epic</b-slider-tick>
        <b-slider-tick :value="4">Legendary</b-slider-tick>
      </b-slider>
    </b-field>

    <b-field label="Collections">
      <b-switch size="is-small">Show </b-switch>
    </b-field>
  </aside>
</template>

<script>
export default {
  props: {
    coinsNumber: Number,
    minYear: Number,
    maxYear: Number,
    years: Array,

    countryList: Array,
    countries: Array,

    volumes: Array,
    maxVolume: Number
  },

  data() {
    return {
      rarity: []
    };
  },

  watch: {
    rarity() {
      this.$emit("update:volumes", [
        this.rarityToVolume(this.rarity[1] + 1),
        this.rarityToVolume(this.rarity[0])
      ]);
    }
  },

  computed: {
    isFiltered() {
      return (
        this.countries.length ||
        this.years[0] !== this.minYear ||
        this.years[1] !== this.maxYear ||
        this.rarity[1] < 4 ||
        this.rarity[0] > 0
      );
    }
  },

  methods: {
    reset() {
      this.$emit("update:years", [this.minYear, this.maxYear]);
      this.$emit("update:countries", []);
      this.rarity = [0, 4];
    },

    rarityToVolume(rarity) {
      switch (rarity) {
        case 0:
          return this.maxVolume;
        case 1:
          return 10000000;
        case 2:
          return 2000000;
        case 3:
          return 1000000;
        case 4:
          return 200000;
        default:
          return 0;
      }
    }
  }
};
</script>

<style scoped>
aside {
  margin-top: 40px;
  padding-left: 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
}

.rarity {
  margin-left: 1rem;
  margin-right: 1rem;
}
</style>

<i18n>
{
  "en": {
    "displayed": "Coins displayed",
    "reset": "Reset",
    "countries": "Countries",
    "years": "Years",
    "rarity": "Rarity"
  },
  "fr": {
    "displayed": "Nombre de pièces affichées",
    "reset": "Réinitialiser",
    "countries": "Pays",
    "years": "Années",
    "rarity": "Rareté"
  }
}
</i18n>
