const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const resolve = (dir) => path.resolve(__dirname, dir);

module.exports = {
  mode: 'production',
  entry: './src/index',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.less$/i,
        use: [
          // compiles Less to CSS
          'style-loader',
          'css-loader',
          'less-loader'
        ],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': resolve('src')
    }
  },
  target: ['web', 'es5'],
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new SimpleProgressWebpackPlugin(),
    new BundleAnalyzerPlugin()
  ],
  output: {
    filename: '[name]-[chunkhash].js'
  },
  devServer: {
    port: 9000,
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
};
