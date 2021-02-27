module.exports = {
    lintOnSave: false,
    devServer: {
    proxy: {
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      '/api': {
        target: 'http://123.207.223.107:10000/',
        changeOrigin: true,
        pathRewrite: {
          '^/api' : 'http://123.207.223.107:10000/'
        }
      }
    }
  },

}