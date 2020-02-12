const path = require('path');

module.exports = {
  pluginOptions: {
    i18n: {
      locale: 'fr',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true,
      silentTranslationWarn: true,
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, 'src')
      }
    }
  },
  publicPath: process.env.NODE_ENV === 'production'
  ? '/collector/'
  : '/'
}
