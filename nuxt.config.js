module.exports = {
  /*
  ** Headers of the page
  */
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
  css: [
    "@/assets/scss/common.scss",
    "@/assets/scss/element-variables.scss",
    "@/assets/iconfont/iconfont.css"
  ],
  plugins: [
    "@/plugins/element-ui",
    "@/plugins/axios"
  ],
  /*
  ** Customize the progress bar color
  */
  modules: [
    "@nuxtjs/axios"
  ],
  router: {
    extendRoutes(routes, resolve) {
    }
  },
  loading: {
    color: "#3B8070"
  },
  target: 'static',
  /*
  ** Build configuration
  */
  build: {
    transpile: [/^element-ui/],
    extend(config, ctx) {
    },
    maxChunkSize: 300000, // 单个包最大尺寸
    extractCSS: true, // 单独提取CSS
    babel: {
      plugins: [
        [
          'component',
          {
            libraryName: 'element-ui',
            styleLibraryName: 'theme-chalk'
          }
        ]
      ]
    }
  },
  server: {
    port: 3000
  },
  env: {
    baseUrl: 'https://account-api.easyapi.com',
  }
};