<template>
  <div class="card" style="width: auto">
    <header class="modal-card-head">
      <p class="title is-6">{{ $t("share") }}</p>
    </header>
    <section class="card-content">
      <p class="custom-label">{{ $t("nameInfo") }}</p>
      <b-field>
        <b-input v-model="name" :placeholder="$t('name')"></b-input>
      </b-field>
      <br />
      <p class="custom-label">{{ $t("linkInfo") }}</p>
      <b-field :message="dynamicMessage">
        <b-input
          id="shareURL"
          :value="url"
          expanded
          icon-right="copy"
          icon-right-clickable
          @focus="copyToClipboard"
          @icon-right-click="copyToClipboard"
        ></b-input>
      </b-field>
      <p></p>
    </section>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      isCopied: false,
      name: ""
    };
  },

  computed: {
    dynamicMessage() {
      return this.$t(this.isCopied ? "copied" : "uncopied");
    },

    url() {
      const location = window.location.toString();
      const basePath = location.slice(0, location.lastIndexOf("/"));

      return encodeURI(
        basePath +
          "/s/" +
          this.exportCollection +
          (this.name ? `/${this.name}` : "")
      );
    },

    ...mapGetters(["exportCollection"])
  },

  methods: {
    copyToClipboard() {
      document.getElementById("shareURL").select();
      document.execCommand("copy");
      this.isCopied = true;
    }
  }
};
</script>

<style scoped>
.custom-label {
  margin-bottom: 0.5rem;
}
</style>

<i18n>
{
  "en": {
    "share": "Share your collection",
    "linkInfo": "You can share this link to give access to your collection :",
    "nameInfo": "You can add a name to this collection for your receiver :",
    "uncopied": "You can clic on to copy the link to your clipboard",
    "copied": "Link is copied!",
    "name": "E.g. Chuck’s collection"
  },
  "fr": {
    "share": "Partage de votre collection",
    "linkInfo": "Vous pouvez partager ce lien pour faire découvrir votre collection:",
    "nameInfo": "Vous pouvez ajouter un nom de la collection pour votre destinataire:",
    "uncopied": "Cliquez sur le lien pour le copier",
    "copied": "Le lien a bien été copié !",
    "name": "Example: Collection de Fapien"
  }
}
</i18n>
