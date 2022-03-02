const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  lintOnSave: process.env.NODE_ENV === 'development',
  devServer: {
    // open: true,
    before: require('./mock/mock-server.js')
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src'),
        '@com': resolve('src/components'),
        '@v': resolve('src/views'),
        '@u': resolve('src/utils')
      }
    }
  },
  chainWebpack(config) {
    config.module.rule('svg').exclude.add(resolve('src/icons')).end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  }
}
