<template>
  <b-navbar>
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
        <b-navbar-item @click="$root.$i18n.locale = lang" v-for="lang in languages" :key="lang">
          <span :class="getFlagClass(lang)"></span>
          {{ lang === 'fr' ? 'Français' : 'English' }}
        </b-navbar-item>
        <div slot="label">
          <span :class="getFlagClass($i18n.locale)"></span>
          <b-icon icon="language" />
        </div>
      </b-navbar-dropdown>

      <b-navbar-item tag="div">
        <div class="buttons">
          <b-button
            type="is-info"
            size="is-small"
            icon-left="file-export"
            outlined
            rounded
          >{{ $t('export') }}</b-button>

          <b-button size="is-small" icon-left="file-import" outlined rounded>{{ $t('import' )}}</b-button>
        </div>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script>
import { SUPPORTED_LANGUAGES } from "@/constants.js";

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
      return `flag-icon flag-icon-${locale === 'en' ? 'gb' : locale}`
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
}
</style>

<i18n>
{
  "en": {
    "export": "Export Collection",
    "import": "Import Collection",
    "search": "Search..."
  },
  "fr": {
    "export": "Sauvegarder la collection",
    "import": "Récupérer la collection",
    "search": "Rechercher..."
  }
}
</i18n>
