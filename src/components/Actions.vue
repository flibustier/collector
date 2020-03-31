<template>
  <nav class="level">
    <div class="level-left">
      <div class="level-item">
        <b-field>
          <b-input
            :placeholder="$t('owned')"
            :value="currentCollectionName"
            @input="name => setCollectionName({ name })"
          ></b-input>
        </b-field>
      </div>
      <div class="level-item">
        <h1>
          [
          {{ numberOfOwnedCoins }}
          {{ $t("coins") }}
          ]
        </h1>
      </div>
    </div>

    <div class="level-right">
      <r-button icon="share" text="Share" is-info />
      <r-button icon="file-export" text="Export" />
      <r-button icon="chart-pie" text="Statistics" />
      <r-button
        icon="trash"
        text="Delete"
        is-danger
        @click="deleteCollection"
        :disabled="!currentCollectionID"
      />
    </div>
  </nav>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import RButton from "./atoms/Button";

export default {
  components: {
    RButton
  },

  computed: {
    ...mapGetters([
      "numberOfOwnedCoins",
      "currentCollectionName",
      "currentCollectionID"
    ])
  },

  methods: {
    ...mapActions(["setCollectionName", "deleteCollection"])
  }
};
</script>

<style scoped>
nav.level {
  padding: 1rem;
  margin-bottom: 0;
}
</style>

<i18n>
{
  "en": {
    "coins": "coins"

  },
  "fr": {
    "coins": "pieces"
  }
}
</i18n>
