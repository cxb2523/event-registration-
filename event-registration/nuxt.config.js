export default {
  head: {
    title: '活动报名系统',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '活动报名系统' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  css: [
    '~/assets/css/main.css'
  ],

  plugins: [],

  components: true,

  buildModules: [],

  modules: [
    '@nuxtjs/axios'
  ],

  axios: {
    baseURL: 'http://localhost:3001/api',
    browserBaseURL: 'http://localhost:3001/api'
  },

  build: {},

  server: {
    port: 3000
  }
}
