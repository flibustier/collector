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
      <r-button
        icon="share"
        :text="$t('share')"
        is-info
        @click="showShareModal"
        :disabled="!numberOfOwnedCoins"
      />
      <r-button
        icon="file-export"
        :text="$t('export')"
        @click="notImplemented"
      />
      <r-button
        icon="chart-pie"
        :text="$t('statistics')"
        @click="notImplemented"
      />
      <r-button
        icon="trash"
        :text="$t('delete')"
        is-danger
        @click="confirmDelete"
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
    },

    confirmDelete() {
      this.$buefy.dialog.confirm({
        title: this.$t("delete"),
        message: this.$t("confirmDelete"),
        confirmText: this.$t("delete"),
        cancelText: this.$t("cancel"),
        type: "is-danger",
        hasIcon: true,
        onConfirm: this.deleteCollection
      });
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
    "share": "Share",
    "export": "Export",
    "statistics": "Statistics",
    "wip": "This feature will come very soon!",
    "delete": "Delete",
    "cancel": "Abort",
    "confirmDelete": "Are you sure you want to <b>delete</b> your collection? This action cannot be undone."

  },
  "fr": {
    "coins": "pieces",
    "share": "Partager",
    "export": "Exporter",
    "statistics": "Statistiques",
    "wip": "Cette fonctionnalité n’est pas encore disponible, encore un peu de patience!",
    "delete": "Suppression",
    "cancel": "Annuler",
    "confirmDelete": "Êtes-vous certain de vouloir supprimer <b>définitivement</b> votre collection ?<br/> Cette action est irréversible."
  }
}
</i18n>
