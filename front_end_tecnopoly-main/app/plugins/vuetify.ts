import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { es } from 'vuetify/locale'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    locale: {
      locale: 'es',
      messages: { es },
    },
    theme: {
      defaultTheme: 'dark',
      themes: {
        dark: {
          dark: true,
          colors: {
            primary:    '#00E5FF',   // cyan neón
            secondary:  '#7C4DFF',   // violeta
            accent:     '#FF6D00',   // naranja
            error:      '#FF1744',
            warning:    '#FFD740',
            info:       '#40C4FF',
            success:    '#00E676',   // verde neón
            background: '#0A0E1A',
            surface:    '#111827',
          },
        },
      },
    },
    defaults: {
      VCard: { rounded: 'lg' },
      VBtn: { rounded: 'lg' },
      VTextField: { rounded: 'lg', variant: 'outlined' },
      VTextarea: { rounded: 'lg', variant: 'outlined' },
      VSelect: { rounded: 'lg', variant: 'outlined' },
      VAutocomplete: { rounded: 'lg', variant: 'outlined' },
    },
  })
  app.vueApp.use(vuetify)
})
