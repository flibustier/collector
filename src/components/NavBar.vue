<template>
  <b-navbar shadow :close-on-click="false">
    <template slot="brand">
      <b-navbar-item
        class="brand-link"
        tag="router-link"
        :to="{ name: 'catalogue' }"
      >
        <logo class="logo" :active="isFetching" />
        <h1 class="is-size-3 brand-title">Collector</h1>
      </b-navbar-item>
    </template>

    <template slot="end">
      <b-navbar-item tag="router-link" :to="{ name: 'catalogue' }">
        {{ $t("catalogue") }}
      </b-navbar-item>

      <b-navbar-dropdown :label="currentCollectionName">
        <b-navbar-item
          tag="router-link"
          :to="routeToCollection(index)"
          v-for="(name, index) in collectionsNames"
          :key="index"
          >{{ name }}</b-navbar-item
        >
        <b-navbar-item @click="createCollection">
          <b-icon icon="plus-circle" />
          <span>{{ $t("create") }}</span>
        </b-navbar-item>
      </b-navbar-dropdown>

      <b-navbar-item tag="div">
        <search />
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
        </div>
      </b-navbar-dropdown>

      <b-navbar-dropdown right>
        <b-navbar-item @click="showSettingsModal">
          <b-icon icon="sliders-v" />
          <span>{{ $t("settings") }}</span>
        </b-navbar-item>

        <b-navbar-item @click="showSettingsModal">
          <b-icon icon="info-circle" />
          <span>{{ $t("about") }}</span>
        </b-navbar-item>

        <b-icon slot="label" icon="ellipsis-h" />
      </b-navbar-dropdown>
    </template>
  </b-navbar>
</template>

<script>
import { SUPPORTED_LANGUAGES } from "../constants.mjs";
import Logo from "./atoms/Logo";
import Search from "./atoms/Search";
import Settings from "./modals/Settings";

import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    Logo,
    Search
  },

  computed: {
    ...mapGetters(["collectionsNames", "currentCollectionName", "isFetching"]),

    languages: () => SUPPORTED_LANGUAGES
  },

  methods: {
    ...mapActions(["createCollection"]),

    getFlagClass: locale =>
      `flag-icon flag-icon-${locale === "en" ? "gb" : locale}`,

    showSettingsModal() {
      this.$buefy.modal.open({
        parent: this,
        component: Settings,
        hasModalCard: true
      });
    },

    routeToCollection: id => ({ name: "collection", params: { id } }),

    isActive(routeName) {
      return this.$router.currentRoute.name === routeName;
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
    "settings": "Settings",
    "create": "Add a new collection",
    "catalogue": "Catalog",
    "about": "About"
  },
  "fr": {
    "export": "Sauvegarder la collection",
    "import": "Récupérer la collection",
    "search": "Rechercher...",
    "settings": "Paramètres",
    "create": "Ajouter une nouvelle collection",
    "catalogue": "Catalogue",
    "about": "À propos"
  }
}
</i18n>
