# @self-denial-cy/vue-super-tree

基于`vue@2`的树形组件，支持`npm`和`script`两种使用方式，支持海量树节点和一些自定义的属性。

# 安装和使用

## npm引入

### 安装

```shell
npm install --save @self-denial-cy/vue-super-tree
```

### 使用

#### 全局注册

```javascript
import Vue from 'vue'
import VueSuperTree from "@self-denial-cy/vue-super-tree"
Vue.use(VueSuperTree)
```

#### 局部引入组件

```javascript
import VueSuperTree from "@self-denial-cy/vue-super-tree"

export default {
    components: {
        VueSuperTree
    },
    // 其他代码
}
```

#### 使用示例

```html
<div id="app">
  <vue-super-tree
    :tree="treeData"
    valueKey="_key"
    :height="height"
    :padding="36"
  >
    <template v-slot="{ item }">
      <span>{{ item._key }}</span>
    </template>
  </vue-super-tree>
</div>
```

```javascript
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
```

## script标签引用

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.bootcss.com/vue/2.6.11/vue.min.js"></script>
  <script src="path-to/vue-super-tree.umd.min.js"></script>
</head>
<body>
  <div id="app"></div>
  <script>
    new Vue({
      el: "#app",
      template: '<vue-super-tree :tree="treeData"></vue-super-tree>'
    })
  </script>
</body>
</html>
```

# 支持的组件属性

| 参数             | 说明                        | 类型     | 是否必传 | 默认值 |
| :--------------: | :-------------------------- | :------: | :------: | :----: |
| tree | 树形结构数据                | Array | true | [] |
| defaultExpand | 是否默认展开              | Boolean | false    | false |
| timeout | 刷新频率（数值越低越精确，但是性能消耗也会大大增加） | Number   | false    | 8 |
| height | 滚动容器的高度         | Number   | false    | 720 |
| itemHeight | 单个 item 的高度       | Number | false    | 32 |
| childrenKey | children 字段的 key | String | false    | children |
| valueKey | value 字段的 key | String | false    | value |
| expandKey | expand 字段的 key | String | false    | expand |
| padding | 节点的段间距          | Number | false    | 24 |