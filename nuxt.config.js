const path = require('path')

module.exports = {
  /*
   ** Headers of the page
   */
  head: {
    title: '{{ name }} - EasyAPI',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: '{{escape description }}'
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  css: ['@/assets/scss/common.scss', '@/assets/scss/element-variables.scss'],
  plugins: ['@/plugins/element-ui', '@/plugins/axios', { src: '@/plugins/icons', ssr: false }],
  /*
   ** Customize the progress bar color
   */
  modules: ['@nuxtjs/axios'],
  buildModules: ['@nuxtjs/tailwindcss'],
  tailwindcss: {
    cssPath: '@/assets/css/tailwind.css',
    configPath: 'tailwind.config.js',
    exposeConfig: false,
    config: {}
  },
  router: {
    extendRoutes(routes, resolve) {}
  },
  loading: {
    color: '#3B8070'
  },
  target: 'static',
  /*
   ** Build configuration
   */
  build: {
    transpile: [/^element-ui/],
    extend(config, ctx) {
      config.node = {
        fs: 'empty'
      }
      const svgRule = config.module.rules.find(rule => rule.test.test('.svg'))
      svgRule.exclude = [path.resolve(__dirname, 'assets/svg')]
      // Includes /icons/svg for svg-sprite-loader
      config.module.rules.push({
        test: /\.svg$/,
        include: [path.resolve(__dirname, 'assets/svg')],
        loader: 'svg-sprite-loader',
        options: {
          symbolId: 'icon-[name]'
        }
      })
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
    serviceUrl: 'https://api.easyapi.com'
  }
}
