import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  //...
  build: {
    transpile: ['vuetify'],
  },

  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    //...
  ],

  vite: {
    define: {
      'process.env.DEBUG': false,
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "vuetify/styles" as *;'
        }
      }
    },
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },

  compatibilityDate: '2025-02-23',

  runtimeConfig: {
    geminiApiKey: process.env.GEMINI_API_KEY,
    public: {
      // Public runtime config
    }
  },

  css: [
    '@mdi/font/css/materialdesignicons.css'
  ],
})