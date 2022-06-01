<template>
  <div id="app">
    <vue-super-tree
      :tree="treeData"
      valueKey="_key"
      :height="height"
      :padding="36"
      defaultExpand
    >
      <template v-slot="{ item }">
        <span>{{ item._key }}</span>
      </template>
    </vue-super-tree>
  </div>
</template>

<script>
import treeData from "./api/index";

export default {
  name: "App",
  data() {
    return {
      treeData,
      height: 0,
    };
  },
  created() {
    this.height = document.documentElement.clientHeight - 16;
  },
};
</script>
