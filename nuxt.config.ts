// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "Project",
      meta: [
        {charset: 'utf-8'},
        {name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {hid: 'description', name:'description',content: 'Project meta desc'},
        {name: 'format-detection', content:'telephone=no'}
      ]
    }
  },

  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  pages: true,
  modules: ["@nuxt/image"]
})