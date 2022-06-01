<template>
  <!-- 虚拟树组件 -->
  <div
    class="s-tree"
    ref="tree"
    :style="`height: ${height}px`"
    @scroll="handleScroll"
  >
    <div class="s-tree__phantom" :style="`height: ${contentHeight}px`"></div>
    <div class="s-tree__content" :style="`transform: translateY(${offset}px)`">
      <div
        v-for="(item, index) in visibleData"
        class="s-tree__item"
        :key="index"
        :class="{
          's-tree__item__selected': item[valueKey] === checkKey,
        }"
        :style="{
          paddingLeft: padding * (item.level - 1) + 'px',
          height: itemHeight + 'px',
        }"
        @click="handleCheck(item)"
      >
        <i
          :class="item[expandKey] ? 's-tree__expand' : 's-tree__shrink'"
          @click="handleToggle(item)"
          v-if="item[childrenKey] && item[childrenKey].length"
        />
        <span v-else style="margin-right: 15px"></span>
        <slot :item="item" :index="index"></slot>
      </div>
    </div>
  </div>
</template>

<script>
let lastTime = 0;

export default {
  name: "VueSuperTree",
  props: {
    tree: {
      type: Array,
      required: true,
      default() {
        return [];
      },
    },
    defaultExpand: {
      type: Boolean,
      default: false,
    },
    timeout: {
      // 刷新频率
      type: Number,
      default: 16,
    },
    height: {
      // 滚动容器的高度
      type: Number,
      default: 720,
    },
    itemHeight: {
      // 单个 item 的高度
      type: Number,
      default: 32,
    },
    childrenKey: {
      type: String,
      default: "children",
    },
    valueKey: {
      type: String,
      default: "value",
    },
    expandKey: {
      type: String,
      default: "expand",
    },
    padding: {
      type: Number,
      default: 24,
    },
  },
  data() {
    return {
      offset: 0, // translateY 偏移量
      contentHeight: 0,
      visibleData: [],
      checkKey: -1,
    };
  },
  computed: {
    // 将树结构扁平化
    flattenTree() {
      const { tree, childrenKey, expandKey, defaultExpand } = this;
      const topNode = {
        level: 0,
        visible: true,
      };
      topNode[expandKey] = true;
      topNode[childrenKey] = tree;

      function flatten(tree, childrenKey, level, parent, defaultExpand) {
        const arr = [];
        if (Array.isArray(tree)) {
          tree.forEach((item) => {
            item.level = level;
            if (item[expandKey] === undefined) {
              item[expandKey] = defaultExpand;
            }
            if (item.visible === undefined) {
              item.visible = true;
            }
            if (!parent.visible || !parent[expandKey]) {
              item.visible = false;
            }
            item.parent = parent;
            arr.push(item);
            if (item[childrenKey] && Array.isArray(item[childrenKey])) {
              arr.push(
                ...flatten(
                  item[childrenKey],
                  childrenKey,
                  level + 1,
                  item,
                  defaultExpand
                )
              );
            }
          });
        }
        return arr;
      }
      return flatten(tree, childrenKey, 1, topNode, defaultExpand);
    },
    // 视图内展示的节点个数
    visibleCount() {
      return Math.floor(this.height / this.itemHeight);
    },
  },
  mounted() {
    this.updateView();
  },
  methods: {
    handleCheck(item) {
      const { valueKey } = this;
      this.checkKey = item[valueKey];
      this.$emit("on-change", item);
    },
    updateView() {
      this.getContentHeight();
      this.handleScroll();
    },
    getContentHeight() {
      const visibleNodes = this.flattenTree.filter((item) => item.visible);
      this.contentHeight = visibleNodes.length * this.itemHeight;
    },
    handleScroll() {
      const currentTime = +new Date();
      if (currentTime - lastTime > this.timeout) {
        this.updateVisibleData(this.$refs.tree.scrollTop);
        lastTime = currentTime;
      }
    },
    updateVisibleData(scrollTop) {
      let start =
        Math.floor(scrollTop / this.itemHeight) -
        Math.floor(this.visibleCount / 2);
      start = start < 0 ? 0 : start;

      const end = start + this.visibleCount * 2;

      const allVisibleData = this.flattenTree.filter((item) => item.visible);

      this.visibleData = allVisibleData.slice(start, end);

      this.offset = start * this.itemHeight;
    },
    handleToggle(item) {
      const { expandKey } = this;
      const isExpand = item[expandKey];
      if (isExpand) {
        // 折叠
        this.collapse(item);
      } else {
        // 展开
        this.expand(item);
      }
      this.updateView();
    },
    // 折叠节点
    collapse(item) {
      const { expandKey, childrenKey } = this;
      item[expandKey] = false;
      this.recursionVisible(item[childrenKey], false);
    },
    // 展开节点
    expand(item) {
      const { expandKey, childrenKey } = this;
      item[expandKey] = true;
      this.recursionVisible(item[childrenKey], true);
    },
    // 递归节点
    recursionVisible(children, status) {
      const { expandKey, childrenKey } = this;
      children.forEach((node) => {
        node.visible = status;
        node[expandKey] = status;
        if (node[childrenKey] && node[childrenKey].length) {
          this.recursionVisible(node[childrenKey], status);
        }
      });
    },
    // 折叠所有
    collapseAll(level = 1) {
      const { expandKey } = this;
      this.flattenTree.forEach((item) => {
        item[expandKey] = false;
        if (item.level !== level) {
          item.visible = false;
        }
      });
      this.updateView();
    },
    // 展开所有
    expandAll() {
      const { expandKey } = this;
      this.flattenTree.forEach((item) => {
        item[expandKey] = true;
        item.visible = true;
      });
      this.updateView();
    },
  },
};
</script>

<style>
@import url("./index.css");
</style>
