<template>
  <div id="demo">
    <component
      v-if="dynamicComponent"
      :is="dynamicComponent"
      :tree="treeData"
      :height="360"
      valueKey="_key"
    >
      <template v-slot="{ item }">
        <span>{{ item._key }}</span>
      </template>
    </component>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dynamicComponent: null,
      treeData: [],
    };
  },
  created() {
    import("../../../src/api/index").then((module) => {
      this.treeData = module.default;
    });
  },
  mounted() {
    import("../../../src/index").then((module) => {
      this.dynamicComponent = module.default;
    });
  },
};
</script>
