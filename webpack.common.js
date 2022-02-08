const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin');

const resolve = (dir) => path.resolve(__dirname, dir);

module.exports = {
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
    new SimpleProgressWebpackPlugin()
  ],
  output: {
    filename: '[name]-[chunkhash].js'
  }
};
