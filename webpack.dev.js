const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    port: 9000,
    historyApiFallback: true,
    proxy: {
      '/baseapis': {
        target: 'http://test-groupbuy-api.chenxuan100.cn',
        // 是否启用websocket
        ws: false,
        //是否允许跨域
        changeOrigin: true,
        pathRewrite: {
          '^/baseapis': ''
        }
      }
    }
  }
});
