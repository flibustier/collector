<template>
  <b-field>
    <b-input
      :placeholder="$t('search')"
      :value="$store.state.filters.searchInput"
      type="search"
      icon="search"
      @input="
        value => $store.commit('setFilter', { name: 'searchInput', value })
      "
      rounded
    ></b-input>
  </b-field>
</template>

<i18n>
{
  "en": {
    "search": "Search..."
  },
  "fr": {
    "search": "Rechercher..."
  }
}
</i18n>
