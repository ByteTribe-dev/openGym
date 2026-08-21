const { defineConfig } = require('eslint/config')
const expoConfig = require('eslint-config-expo/flat')

module.exports = defineConfig([
  expoConfig,
  { ignores: ['assets/exercises/**', 'src/services/exercise-media-manifest.js', 'src/i18n/locales/**', 'src/i18n/instructions/**'] },
])
