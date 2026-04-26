export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  srcDir: 'app',
  ssr: false,
  devtools: { enabled: true },

  app: {
    head: {
      title: 'Notflex',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap',
        },
      ],
    },
  },

  css: ['@/assets/scss/main.scss'],

  components: [
    { path: 'components', pathPrefix: false },
  ],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/assets/scss/tools/index.scss" as *;`,
        },
      },
    },
  },

  modules: ['@pinia/nuxt', '@nuxt/eslint'],
})
