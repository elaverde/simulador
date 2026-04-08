/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

import './chartjs'
import vuetify from './vuetify'

export function registerPlugins(app) {
  app.use(vuetify)
}
