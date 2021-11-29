module.exports = {
  /*
  ** Headers of the page
  */
  router: {
    middleware: "auth"
  },
  head: {
    title: "{{ name }} - EasyAPI",
    meta: [
      {charset: "utf-8"},
      {name: "viewport", content: "width=device-width, initial-scale=1"},
      {hid: "description", name: "description", content: "{{escape description }}"}
    ],
    link: [
      {rel: "icon", type: "image/x-icon", href: "/favicon.ico"}
    ]
  },
  postcss: [
    require("postcss-pxtorem")({
      rootValue: 40,
      propList: ["*"]
    }),
    require("autoprefixer")({
      browsers: ["Android >= 4.0", "iOS >= 7"]
    })
  ],
  css: [
    "@/assets/scss/common.scss",
    "@/assets/scss/element-variables.scss",
    "@/assets/iconfont/iconfont.css"
  ],
  plugins: ["@/plugins/element-ui", "@/plugins/axios"],
  /*
  ** Customize the progress bar color
  */
  modules: [
    "@nuxtjs/axios"
  ],
  loading: {
    color: "#3B8070"
  },
  /*
  ** Build configuration
  */
  build: {
    transpile: [/^element-ui/],
    extend(config, ctx) {
    },
    maxChunkSize: 300000, // 单个包最大尺寸
    extractCSS: true // 单独提取CSS
  },
  server: {
    port: 3000
  }
};
