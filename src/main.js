import Vue from "vue";
import App from "./App.vue";
import VueSuperTree from "./components/index.vue";

Vue.component(VueSuperTree.name, VueSuperTree);

new Vue({
  render: (h) => h(App),
}).$mount("#app");
