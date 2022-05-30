<template>
  <!-- 虚拟树组件 -->
  <div
    class="b-tree"
    ref="scroller"
    :style="{ height: option.height + 'px' }"
    @scroll="handleScroll"
  >
    <div class="b-tree__phantom" :style="{ height: contentHeight }"></div>
    <div
      class="b-tree__content"
      :style="{ transform: `translateY(${offset}px)` }"
    >
      <div
        v-for="(item, index) in visibleData"
        :key="index"
        :class="{
          'b-tree__list-view': true,
          'b-tree__list-view__selected': item.value == checkId,
        }"
        :style="{
          paddingLeft: 24 * (item.level - 1) + 'px',
          height: option.itemHeight + 'px',
        }"
        @click="check(item)"
      >
        <i
          :class="item.expand ? 'b-tree__expand' : 'b-tree__close'"
          @click="toggleExpand(item)"
          v-if="item.children && item.children.length"
        />
        <span v-else style="margin-right: 10px"></span>
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
    option: {
      // 配置对象
      type: Object,
      required: false,
      default() {
        return {
          height: 720, //滚动容器的高度
          itemHeight: 32, // 单个item的高度
        };
      },
    },
  },
  data() {
    return {
      offset: 0, // translateY偏移量
      contentHeight: "0px",
      visibleData: [],
      checkId: -1,
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
      return Math.floor(this.option.height / this.option.itemHeight);
    },
  },
  mounted() {
    this.updateView();
  },
  methods: {
    check(item) {
      this.checkId = item.value;
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
          this.option.itemHeight +
        "px";
    },
    handleScroll() {
      let currentTime = +new Date();
      if (currentTime - lastTime > this.timeout) {
        this.updateVisibleData(this.$refs.scroller.scrollTop);
        lastTime = currentTime;
      }
    },
    updateVisibleData(scrollTop = 0) {
      let start =
        Math.floor(scrollTop / this.option.itemHeight) -
        Math.floor(this.visibleCount / 2);
      start = start < 0 ? 0 : start;

      const end = start + this.visibleCount * 2;

      const allVisibleData = (this.flattenTree || []).filter(
        (item) => item.visible
      );

      this.visibleData = allVisibleData.slice(start, end);
      this.offset = start * this.option.itemHeight;
    },
    toggleExpand(item) {
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
