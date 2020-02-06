import Vue from "vue";
import VueRouter from "vue-router";
import i18n from "./i18n";
import { SUPPORTED_LANGUAGES } from "../constants.mjs";

Vue.use(VueRouter);

const routes = [
  {
    path: "/:lang",
    component: {
      template: "<router-view></router-view>"
    },
    beforeEnter(to, _from, next) {
      const {
        params: { lang }
      } = to;
      if (!SUPPORTED_LANGUAGES.includes(lang)) return next("fr");
      if (i18n.locale !== lang) i18n.locale = lang;
      return next();
    },
    children: []
  }
];

const router = new VueRouter({
  routes
});

export default router;
