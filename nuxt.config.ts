import vuetify from 'vite-plugin-vuetify'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  css: ['vuetify/styles'], // Global CSS
  build: {
    transpile: ['vuetify'],
  },
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
    ssr: {
      noExternal: ['vuetify'], // Add Vuetify to SSR noExternal array
    },
    // @ts-ignore
    // TODO: remove @ts-ignore once vite-plugin-vuetify is updated to support Vite 5
    plugins: [vuetify({ autoImport: true })], // Vuetify plugin for auto-importing components
  },
  modules: [
    // Vuetify module configuration
    async (options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        if (config.plugins) {
          // @ts-expect-error
          config.plugins.push(vuetify({ autoImport: true }))
        } else {
          // @ts-expect-error
          config.plugins = [vuetify({ autoImport: true })]
        }
      })
    },
    '@pinia/nuxt', // Add Pinia module
  ],
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'https://gas.bxmedia.pro/api',
    }
  }
})
