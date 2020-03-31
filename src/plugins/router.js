import Vue from "vue";
import VueRouter from "vue-router";

import Catalogue from "../components/layouts/Catalogue";
import Collection from "../components/layouts/Collection";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "catalogue",
    component: Catalogue
  },
  {
    path: "/collection/:id",
    name: "collection",
    component: Collection
  },
  {
    path: "/collection/share/:data",
    component: Collection
  }
];

const router = new VueRouter({
  linkExactActiveClass: "is-active",
  routes
});

export default router;
