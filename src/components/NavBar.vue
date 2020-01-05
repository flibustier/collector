<template>
  <b-navbar>
    <template slot="end">
      <b-navbar-item>
        <b-field>
          <b-input
            placeholder="Search..."
            type="search"
            icon="search"
            @input="input => $emit('update:searchInput', input)"
            rounded
          ></b-input>
        </b-field>
      </b-navbar-item>

      <b-navbar-dropdown>
        <b-navbar-item href="#">
          <span class="flag-icon flag-icon-fr"></span>Français
        </b-navbar-item>
        <b-navbar-item href="#">
          <span class="flag-icon flag-icon-gb"></span>English
        </b-navbar-item>
        <span slot="label" class="flag-icon flag-icon-fr"></span>
      </b-navbar-dropdown>

      <b-navbar-item tag="div">
        <div class="buttons">
          <b-button
            type="is-info"
            size="is-small"
            icon-left="file-export"
            outlined
            rounded
          >Export Collection</b-button>

          <b-button
            size="is-small"
            icon-left="file-import"
            outlined
            rounded
          >Import Collection</b-button>
        </div>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script>
export default {
  props: {
    searchInput: String
  }
};
</script>

<style scoped>
.flag-icon {
  margin-right: 1rem;
}
</style>