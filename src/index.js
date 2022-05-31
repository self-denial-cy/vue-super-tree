import VueSuperTree from "./components/index.vue";

VueSuperTree.install = function (Vue) {
  Vue.component(VueSuperTree.name, VueSuperTree);
};

if (typeof window !== "undefined" && window.Vue) {
  // 支持 script 引用
  window.Vue.use(VueSuperTree);
}

// 支持按需加载
export { VueSuperTree };

// 支持全局 Vue.use
export default VueSuperTree;
