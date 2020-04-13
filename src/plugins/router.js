import Vue from "vue";
import VueRouter from "vue-router";

import store from "../store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "catalogue"
  },
  {
    path: "/collection/:id",
    name: "collection"
  },
  {
    path: "/collection/s/:data/:name?",
    redirect: route => {
      const {
        params: { data, name }
      } = route;

      const collection = store.getters.decodeExportedCollection(data);

      store.commit("addCollection", { collection, name });

      store.commit("setFilter", { name: "showOnlyOwned", value: true });

      return `/collection/${store.getters.lastCollectionID}`;
    }
  }
];

const router = new VueRouter({
  linkExactActiveClass: "is-active",
  routes
});

export default router;
