import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VueApexCharts from "vue-apexcharts";
import VueResizeText from './resize.js';

import "@/assets/styles/style.scss";
Vue.use(VueApexCharts);
Vue.use(VueResizeText);

Vue.component("apexchart", VueApexCharts);

new Vue({
  vuetify,
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
