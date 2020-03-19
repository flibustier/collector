<template>
  <b-navbar shadow :close-on-click="false">
    <template slot="brand">
      <b-navbar-item class="brand-link">
        <logo class="logo" />
        <h1 class="is-size-3 brand-title">Collector</h1>
      </b-navbar-item>
    </template>

    <template slot="end">
      <b-navbar-item tag="div">
        <b-field>
          <b-input
            :placeholder="$t('search')"
            :value="$store.state.coins.filters.searchInput"
            type="search"
            icon="search"
            @input="input => $store.commit('setSearchInput', input)"
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
          {{ lang === "fr" ? "Français" : "English" }}
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
          <span>{{ $t("settings") }}</span>
        </b-navbar-item>

        <b-icon slot="label" icon="ellipsis-h" />
      </b-navbar-dropdown>
    </template>
  </b-navbar>
</template>

<script>
import { SUPPORTED_LANGUAGES } from "../constants.mjs";
import Logo from "./Logo";
import Settings from "./Settings";

export default {
  components: {
    Logo
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

.logo {
  width: 2.5rem;
  height: 2.5rem;
  margin-right: 0.5rem;
}

.brand-link {
  padding: 0;
  margin-left: 0.5rem;
}

.brand-title {
  padding-top: 5px;
  line-height: 1;
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
