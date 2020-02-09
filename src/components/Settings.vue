<template>
  <div class="card" style="width: auto">
    <header class="modal-card-head">
      <p class="title is-6">{{ $t("settings") }}</p>
    </header>
    <section class="card-content">
      <b-field :label="$t('quality')" :message="$t('advice')">
        <b-field>
          <b-radio-button
            :value="savedQuality"
            @input="value => $store.commit('setQuality', value)"
            :native-value="quality"
            v-for="(quality, i) in qualityList"
            :key="quality"
            size="is-small"
          >
            <b-icon :icon="`signal-${i + 2}`"></b-icon>
            <span>{{ $t(quality) }}</span>
          </b-radio-button>
        </b-field>
      </b-field>
      <hr />
      <b-field :message="$t('rarityLevels', rarityLevels)">
        <b-switch
          size="is-small"
          :value="displayRarity"
          @input="
            value =>
              $store.commit('setBoolean', { name: 'displayRarity', value })
          "
          >{{ $t("rarity") }}</b-switch
        >
      </b-field>
      <hr />
      <b-field
        v-for="setting in ['showOnlyOwned', 'displayOnly']"
        :key="setting"
      >
        <b-switch
          size="is-small"
          :value="boolean(setting)"
          @input="
            value => $store.commit('setBoolean', { name: setting, value })
          "
          >{{ $t(setting) }}</b-switch
        >
      </b-field>
    </section>
  </div>
</template>

<script>
import { IMAGE_QUALITY } from "../constants.mjs";

import { mapState } from "vuex";

import {
  UNCOMMON_CAP,
  RARE_CAP,
  EPIC_CAP,
  LEGENDARY_CAP
} from "../constants.mjs";

export default {
  computed: {
    qualityList() {
      return Object.values(IMAGE_QUALITY);
    },

    rarityLevels() {
      return [UNCOMMON_CAP, RARE_CAP, EPIC_CAP, LEGENDARY_CAP].map(number =>
        number.toLocaleString()
      );
    },

    ...mapState({
      savedQuality: state => state.settings.quality,
      displayRarity: state => state.settings.rarity,
      showOnlyOwned: state => state.settings.showOnlyOwned,
      displayOnly: state => state.settings.displayOnly
    })
  },

  methods: {
    boolean(name) {
      return this[name];
    }
  }
};
</script>

<i18n>
{
  "en": {
    "settings": "Settings",
    "quality": "Thumbnail Quality",
    "advice": "Lower quality is faster",
    "low": "Low",
    "medium": "Medium",
    "fullsize": "Highest",
    "rarity": "Show levels of rarity",
    "rarityLevels": "Uncommon &lt; {0}, Rare &lt; {1} Epic &lt; {2}, Legendary &lt; {3}",
    "showOnlyOwned": "Display only owned coins",
    "displayOnly": "Consulting mode only, don’t display inventory, just coins"
  },
  "fr": {
    "settings": "Paramétrages",
    "quality": "Qualité des miniatures",
    "advice": "Une qualité plus élevée sera plus lente à charger",
    "low": "Basse",
    "medium": "Moyenne",
    "fullsize": "Maximale",
    "rarity": "Afficher les niveaux de rareté",
    "rarityLevels": "Commune &lt; {0}, Rare &lt; {1} Épique &lt; {2}, Légendaire &lt; {3}",
    "showOnlyOwned": "Afficher uniquement les pièces possédées",
    "displayOnly": "Mode catalogue : Ne pas afficher l’inventaire des pièces possédées"
  }
}
</i18n>
