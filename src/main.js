import Vue from 'vue'
import App from './App.vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import 'flag-icon-css/css/flag-icon.min.css'
import "@fortawesome/fontawesome-pro/css/all.css";

Vue.use(Buefy, {
  defaultIconPack: "fal",
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
