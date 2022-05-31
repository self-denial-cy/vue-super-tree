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
          's-tree__item__selected': item.value === checkKey,
        }"
        :style="{
          paddingLeft: 24 * (item.level - 1) + 'px',
          height: itemHeight + 'px',
        }"
        @click="handleCheck(item)"
      >
        <i
          :class="item.expand ? 's-tree__expand' : 's-tree__shrink'"
          @click="handleToggle(item)"
          v-if="item.children && item.children.length"
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
      required: false,
      default: false,
    },
    timeout: {
      //刷新频率
      type: Number,
      default: 16,
    },
    height: {
      //滚动容器的高度
      type: Number,
      default: 720,
    },
    itemHeight: {
      // 单个item的高度
      type: Number,
      default: 32,
    },
  },
  data() {
    return {
      offset: 0, // translateY偏移量
      contentHeight: 0,
      visibleData: [],
      checkKey: -1,
    };
  },
  computed: {
    // 将树结构扁平化
    flattenTree() {
      function flatten(
        list,
        childKey = "children",
        level = 1,
        parent = null,
        defaultExpand = false
      ) {
        let arr = [];
        if (Array.isArray(list)) {
          list.forEach((item) => {
            item.level = level;
            if (item.expand === undefined) {
              item.expand = defaultExpand;
            }
            if (item.visible === undefined) {
              item.visible = true;
            }
            if (!parent.visible || !parent.expand) {
              item.visible = false;
            }
            item.parent = parent;
            arr.push(item);
            if (item[childKey] && Array.isArray(item[childKey])) {
              arr.push(
                ...flatten(
                  item[childKey],
                  childKey,
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
      return flatten(
        this.tree,
        "children",
        1,
        {
          level: 0,
          visible: true,
          expand: true,
          children: this.tree,
        },
        true
      );
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
      this.checkKey = item.value;
      this.$emit("on-change", item);
    },
    updateView() {
      this.getContentHeight();
      this.$emit("update", this.tree);
      this.handleScroll();
    },
    getContentHeight() {
      this.contentHeight =
        (this.flattenTree || []).filter((item) => item.visible).length *
        this.itemHeight;
    },
    handleScroll() {
      let currentTime = +new Date();
      if (currentTime - lastTime > this.timeout) {
        this.updateVisibleData(this.$refs.tree.scrollTop);
        lastTime = currentTime;
      }
    },
    updateVisibleData(scrollTop = 0) {
      let start =
        Math.floor(scrollTop / this.itemHeight) -
        Math.floor(this.visibleCount / 2);
      start = start < 0 ? 0 : start;

      const end = start + this.visibleCount * 2;

      const allVisibleData = (this.flattenTree || []).filter(
        (item) => item.visible
      );

      this.visibleData = allVisibleData.slice(start, end);
      this.offset = start * this.itemHeight;
    },
    handleToggle(item) {
      const isExpand = item.expand;
      if (isExpand) {
        // 折叠
        this.collapse(item, true);
      } else {
        // 展开
        this.expand(item, true);
      }
      this.updateView();
    },
    // 折叠节点
    collapse(item) {
      item.expand = false;
      this.recursionVisible(item.children, false);
    },
    // 展开节点
    expand(item) {
      item.expand = true;
      this.recursionVisible(item.children, true);
    },
    // 递归节点
    recursionVisible(children, status) {
      children.forEach((node) => {
        node.visible = status;
        node.expand = status;
        if (node.children && node.children.length) {
          this.recursionVisible(node.children, status);
        }
      });
    },
    // 折叠所有
    collapseAll(level = 1) {
      this.flattenTree.forEach((item) => {
        item.expand = false;
        if (item.level != level) {
          item.visible = false;
        }
      });
      this.updateView();
    },
    // 展开所有
    expandAll() {
      this.flattenTree.forEach((item) => {
        item.expand = true;
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
