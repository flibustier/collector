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
          >
            <b-icon :icon="`signal-${i + 2}`"></b-icon>
            <span>{{ $t(quality) }}</span>
          </b-radio-button>
        </b-field>
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
      savedQuality: state => state.settings.quality
    })
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
    "fullsize": "Highest"
  },
  "fr": {
    "settings": "Paramétrages",
    "quality": "Qualité des miniatures",
    "advice": "Une qualité plus élevée sera plus lente à charger",
    "low": "Basse",
    "medium": "Moyenne",
    "fullsize": "Maximale"
  }
}
</i18n>
