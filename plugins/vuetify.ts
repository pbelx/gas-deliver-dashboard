import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    ssr: true,
    components,
    directives,
    icons: {
      defaultSet: 'mdi',
    },
    theme: {
      defaultTheme: 'light', // or 'dark'
      themes: {
        light: {
          dark: false,
          colors: {
            primary: '#1976D2', // Example primary color (Material Blue)
            secondary: '#424242', // Example secondary color (Material Grey Darken-3)
            accent: '#82B1FF',    // Example accent color (Material Blue A100)
            error: '#FF5252',     // Example error color (Material Red A200)
            info: '#2196F3',      // Example info color (Material Blue)
            success: '#4CAF50',   // Example success color (Material Green)
            warning: '#FB8C00',   // Example warning color (Material Orange)
          }
        },
        dark: {
          dark: true,
          colors: {
            primary: '#2196F3', // Example primary color for dark theme
            secondary: '#757575',
            // You can define other colors for the dark theme as well
          }
        }
      }
    }
  })

  nuxtApp.vueApp.use(vuetify)
})
