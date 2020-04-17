<template>
  <div class="card" style="width: auto">
    <header class="modal-card-head">
      <p class="title is-6">
        <b-icon icon="info" />
        <span>{{ $t("about") }}</span>
      </p>
    </header>
    <section class="card-content">
      <div class="content">
        <p class="subtitle is-4 has-text-centered">
          {{ $t("intro1") }}
          <a
            :href="`https://${$i18n.locale}.wikipedia.org/wiki/Open_source`"
            target="_blank"
            >Open Source</a
          >
          {{ $t("intro2") }}
        </p>
        <p class="has-text-justified">
          {{ $t("local") }}
          <br />
          {{ $t("share") }}
        </p>
        <hr />
        <p class="has-text-centered">
          {{ $t("database") }}
          <a href="/database.json" target="_blank">{{
            new Date(databaseVersion).toLocaleDateString()
          }}</a>
        </p>
        <hr />
        <p class="has-text-centered">{{ $t("wikipediaList") }}</p>
        <div v-for="{ lang, urls } in urls" :key="lang" class="url-list">
          <p>
            {{ $t("data") }}
            <span :class="getFlagClass(lang)" />
          </p>
          <ul>
            <li v-for="url in urls" :key="url">
              <a :href="url" target="_blank">{{ url }}</a>
            </li>
          </ul>
        </div>
        <hr />
        <p class="has-text-centered">
          {{ $t("source") }}
          <a href="https://github.com/flibustier/collector" target="_blank">
            Github
            <b-icon pack="fab" icon="github" />
          </a>
        </p>
        <p class="has-text-centered">
          {{ $t("contact") }}
          <a href="mailto:contact@jonathan.pl">
            <span>contact</span>
            <b-icon icon="at" />
            <span>jonathan.pl</span>
          </a>
        </p>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import { WIKIPEDIA_URLS } from "../../extractor/constants.mjs";

import Lang from "../mixins/Lang.mixin";

export default {
  mixins: [Lang],

  computed: {
    ...mapGetters(["databaseVersion"]),

    urls() {
      return Object.entries(WIKIPEDIA_URLS).flatMap(([lang, urls]) => ({
        lang,
        urls: urls.map(({ url }) => decodeURI(url))
      }));
    }
  }
};
</script>

<style scoped>
.url-list {
  margin-bottom: 1rem;
}
</style>

<i18n>
{
  "en": {
    "about": "About the Collector application",
    "into1": "Collector is an",
    "intro2": "application based on Wikipedia’s data and not sharing any personal data",
    "data": "Data",
    "database": "Last database version is from",
    "source": "Source code is available on",
    "contact": "You can send your remarks/suggestions to this email:",
    "wikipediaList": "Following Wikipedia pages are used for the data generation",
    "share": "However, you can share your collection to make a duplicate on the recipient’s computer.",
    "local": "Your collection data is stored in your browser, this way, if you change to an other computer or browser, you will not be able to see the collections created in this browser."
  },
  "fr": {
    "about": "Informations sur l’application Collector",
    "intro1": "Collector est une application",
    "intro2": "basée sur les données de Wikipédia et n’exploitant aucune donnée personnelle.",
    "data": "Données",
    "database": "La dernière version de la base de données des pièces date du",
    "source": "Le code source de l’application est disponible sur",
    "contact": "Vous pouvez envoyer vos questions/remarques à l’adresse suivante:",
    "wikipediaList": "Voici la liste des pages Wikipédia utilisées pour la génération des données",
    "share": "Vous pouvez néanmoins partager votre collection pour créer une copie sur l’ordinateur/navigateur de destination.",
    "local": "L’intégralité des données de vos collections est stockée dans votre navigateur, c’est pourquoi si vous changez d’ordinateur ou de navigateur, vous ne verrez pas les collections créées dans ce navigateur."
  }
}
</i18n>
