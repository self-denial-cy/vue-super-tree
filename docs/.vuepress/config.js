module.exports = {
  base: process.env.NODE_ENV === "production" ? "/vue-super-tree" : "/",
  dest: "example",
  head: [
    ['link', {
      rel: 'icon',
      href: '/assets/img/logo.png'
    }]
  ],
  title: "vue-super-tree | 给力的 Tree 组件",
  description: "基于 Vue@2 开发的 Tree 组件，支持海量树节点渲染和一些自定义属性。",
  themeConfig: {
    logo: "/assets/img/logo.png",
    nav: [{
        text: "首页",
        link: "/"
      },
      {
        text: "使用指南",
        link: "/guide/"
      },
      {
        text: "示例",
        link: "/demo/"
      },
    ],
    lastUpdated: "Last Updated",
    repo: "self-denial-cy/vue-super-tree",
    repoLabel: "查看源码",
  },
  markdown: {
    lineNumbers: true,
  },
};