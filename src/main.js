import Vue from "vue";
import App from "./App.vue";
import Buefy from "buefy";
import "buefy/dist/buefy.css";
import "flag-icon-css/css/flag-icon.min.css";
import "@fortawesome/fontawesome-pro/css/all.css";
import i18n from "./plugins/i18n";
import store from "./store";

Vue.use(Buefy, {
  defaultIconPack: "fal"
});

Vue.config.productionTip = false;

new Vue({
  i18n,
  store,
  render: h => h(App)
}).$mount("#app");
