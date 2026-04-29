export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  srcDir: 'app',
  ssr: false,
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      apiUrl: '',
    },
  },

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

  modules: ['@pinia/nuxt', '@nuxt/eslint', '@nuxtjs/tailwindcss', '@nuxtjs/i18n'],

  i18n: {
    locales: [
      {
        code: 'vi',
        language: 'vi-VN',
        files: ['vi/shared.json', 'vi/browse.json', 'vi/series.json', 'vi/films.json', 'vi/new-popular.json', 'vi/my-list.json', 'vi/browse-lang.json', 'vi/auth.json'],
      },
      {
        code: 'en',
        language: 'en-US',
        files: ['en/shared.json', 'en/browse.json', 'en/series.json', 'en/films.json', 'en/new-popular.json', 'en/my-list.json', 'en/browse-lang.json', 'en/auth.json'],
      },
    ],
    defaultLocale: 'vi',
    langDir: 'locales',
    strategy: 'no_prefix',
    vueI18n: './i18n.config.ts',
  },

  devServer: {
    port: 8386,
  },
})
