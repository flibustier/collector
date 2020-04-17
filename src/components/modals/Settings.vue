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
            @input="setQuality"
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
          @input="value => setBoolean({ name: 'displayRarity', value })"
          >{{ $t("rarity") }}</b-switch
        >
      </b-field>
      <hr />
      <b-field>
        <b-switch
          size="is-small"
          :value="displayID"
          @input="value => setBoolean({ name: 'displayID', value })"
          >{{ $t("displayID") }}</b-switch
        >
      </b-field>
    </section>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

import {
  IMAGE_QUALITY,
  UNCOMMON_CAP,
  RARE_CAP,
  EPIC_CAP,
  LEGENDARY_CAP
} from "../../constants.mjs";

export default {
  computed: {
    qualityList: () => Object.values(IMAGE_QUALITY),

    rarityLevels: () =>
      [UNCOMMON_CAP, RARE_CAP, EPIC_CAP, LEGENDARY_CAP].map(number =>
        number.toLocaleString()
      ),

    ...mapState({
      savedQuality: state => state.settings.quality,
      displayRarity: state => state.settings.displayRarity,
      displayID: state => state.settings.displayID
    })
  },

  methods: {
    ...mapMutations(["setBoolean", "setQuality"])
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
    "rarityLevels": "Uncommon &lt; {0}, Rare &lt; {1}, Epic &lt; {2}, Legendary &lt; {3}",
    "displayID": "Display coin’s identifier"
  },
  "fr": {
    "settings": "Paramétrages",
    "quality": "Qualité des miniatures",
    "advice": "Une qualité plus élevée sera plus lente à charger",
    "low": "Basse",
    "medium": "Moyenne",
    "fullsize": "Maximale",
    "rarity": "Afficher les niveaux de rareté",
    "rarityLevels": "Commune &lt; {0}, Rare &lt; {1}, Épique &lt; {2}, Légendaire &lt; {3}",
    "displayID": "Afficher les numéros d’identification des pièces"
  }
}
</i18n>
