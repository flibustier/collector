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
      <r-button icon="share" text="Share" is-info @click="showShareModal" />
      <r-button icon="file-export" text="Export" @click="notImplemented" />
      <r-button icon="chart-pie" text="Statistics" @click="notImplemented" />
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
import Share from "./modals/Share";

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
    ...mapActions(["setCollectionName", "deleteCollection"]),

    showShareModal() {
      this.$buefy.modal.open({
        parent: this,
        component: Share,
        hasModalCard: true
      });
    },

    notImplemented() {
      this.$buefy.snackbar.open(this.$t("wip"));
    }
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
    "coins": "coins",
    "wip": "This feature will come very soon!"

  },
  "fr": {
    "coins": "pieces",
    "wip": "Cette fonctionnalité n’est pas encore disponible, encore un peu de patience!"
  }
}
</i18n>
