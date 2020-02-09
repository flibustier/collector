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

export default {
  computed: {
    qualityList() {
      return Object.values(IMAGE_QUALITY);
    },

    ...mapState({
      savedQuality: state => state.settings.quality,
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
    "showOnlyOwned": "Afficher uniquement les pièces possédées",
    "displayOnly": "Mode catalogue : Ne pas afficher l’inventaire des pièces possédées"
  }
}
</i18n>
