<template>
  <b-navbar shadow>
    <template slot="brand">
      <b-navbar-item>
        <p>Toss a Coin</p>
      </b-navbar-item>
    </template>

    <template slot="end">
      <b-navbar-item>
        <b-field>
          <b-input
            :placeholder="$t('search')"
            type="search"
            icon="search"
            @input="input => $emit('update:searchInput', input)"
            rounded
          ></b-input>
        </b-field>
      </b-navbar-item>

      <b-navbar-dropdown>
        <b-navbar-item
          @click="$root.$i18n.locale = lang"
          v-for="lang in languages"
          :key="lang"
          :active="lang === $i18n.locale"
        >
          <span :class="getFlagClass(lang)"></span>
          {{ lang === 'fr' ? 'Français' : 'English' }}
        </b-navbar-item>
        <div slot="label">
          <span :class="getFlagClass($i18n.locale)"></span>
          <b-icon icon="language" />
        </div>
      </b-navbar-dropdown>

      <b-navbar-dropdown right>
        <b-navbar-item v-for="action in ['export', 'import']" :key="action">
          <b-icon :icon="`file-${action}`" />
          <span>{{ $t(action) }}</span>
        </b-navbar-item>

        <b-navbar-item @click="showSettingsModal">
          <b-icon icon="sliders-v" />
          <span>{{ $t('settings') }}</span>
        </b-navbar-item>

        <b-icon slot="label" icon="ellipsis-h" />
      </b-navbar-dropdown>
    </template>
  </b-navbar>
</template>

<script>
import { SUPPORTED_LANGUAGES } from "../constants.mjs";
import Settings from "./Settings";

export default {
  props: {
    searchInput: String
  },

  computed: {
    languages() {
      return SUPPORTED_LANGUAGES;
    }
  },

  methods: {
    getFlagClass(locale) {
      return `flag-icon flag-icon-${locale === "en" ? "gb" : locale}`;
    },

    showSettingsModal() {
      this.$buefy.modal.open({
        parent: this,
        component: Settings,
        hasModalCard: true
      });
    }
  }
};
</script>

<style scoped>
.flag-icon {
  margin-right: 1rem;
}

.icon {
  vertical-align: middle;
  margin-right: 0.5rem;
}
</style>

<i18n>
{
  "en": {
    "export": "Export Collection",
    "import": "Import Collection",
    "search": "Search...",
    "settings": "Settings"
  },
  "fr": {
    "export": "Sauvegarder la collection",
    "import": "Récupérer la collection",
    "search": "Rechercher...",
    "settings": "Paramètres"
  }
}
</i18n>
