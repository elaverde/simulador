/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true,
        colors: {
          background: '#121212',
          surface: '#1a1a1a',
          'surface-bright': '#242424',
          primary: '#3987e5',
          secondary: '#9085e9',
          success: '#0ca30c',
          warning: '#d95926',
          error: '#e66767',
          info: '#199e70',
        },
      },
    },
  },
  defaults: {
    VCard: { rounded: 'lg' },
    VTextField: { rounded: 'lg' },
    VBtn: { rounded: 'lg' },
    VDialog: { rounded: 'lg' },
  },
})
