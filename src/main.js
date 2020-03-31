import Vue from "vue";
import { sync } from 'vuex-router-sync';
import Buefy from "buefy";
import "flag-icon-css/css/flag-icon.min.css";
import "@fortawesome/fontawesome-pro/css/all.css";
import "./custom.scss";

import i18n from "./plugins/i18n";
import router from './plugins/router';
import store from "./store";

import App from "./App.vue";

sync(store, router);

Vue.use(Buefy, {
  defaultIconPack: "fal"
});

Vue.config.productionTip = false;

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount("#app");
