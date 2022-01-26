# react-webpack-base

从零开始搭建 React 基础框架

### 技术选型

webpack 5 + react17 + typescript + react-router-dom v6

```
webpack：用于编译 JavaScript 模块
webpack-cli：用于在命令行中运行 webpack
webpack-dev-serve：可以在本地起一个 http 服务，通过简单的配置还可指定其端口、热更新的开启等
webpack-merge：用于合并webpack公共配置
html-webpack-plugin：用于打包html文件
```

### 搭建顺序

- 一、webpack 可用
- 二、支持 typescript
- 三、babel
- 四、引入 React
- 五、React 生态

## 基础

- 安装

```bash
npm install react react-dom
```

## webpack 配置

- 安装

```bash
npm install webpack webpack-cli -D
```

- webpack-dev-server

```bash
# 安装
npm install webpack-dev-server -D

# package.json 配置 scripts
"serve": "webpack serve"
```

##### html-webpack-plugin

该插件将为你生成一个 HTML5 文件， 在 body 中使用 script 标签引入你所有 webpack 生成的 bundle。

```bash
npm install html-webpack-plugin
```

```js
// webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  ...,
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'public/index.html'
    })
  ]
};

```

### 观察打包进度

```bash
npm install simple-progress-webpack-plugin -D
```

```js
// craco.config.js
webpack: {
  plugins: [
    // 查看打包的进度
    new SimpleProgressWebpackPlugin()
  ];
}
```

### 打包体积分析 - webpack-bundle-analyzer

[npm](https://www.npmjs.com/package/webpack-bundle-analyzer)

```js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [new BundleAnalyzerPlugin()]
};
```

### TypeScript

[link](https://webpack.js.org/guides/typescript/)

- 安装依赖

```bash
npm install --save-dev typescript ts-loader
```

```js
module.exports = {
  ...,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  ...
};
```

- 遇到问题

```js
// 以下写法在ts上报错
import React from 'react';
// 需调整为
import * as React from 'react';

// 不需调整，增加tsconfig.json 配置
"allowSyntheticDefaultImports": true,
```

```js
// ts报错类型“NodeRequire”上不存在属性“context”

// 解决方法
pnpm install @types/webpack-env -D
```

```js
// 别名配置
// webpack.config.js
const path = require('path');
const resolve = (dir) => path.resolve(__dirname, dir);
module.exports = {
  resolve: {
    alias: {
      '@': resolve('src')
    }
  }
}

// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    }
  },
}

```

```js
// 引入React无智能提示，报错“React”指 UMD 全局，但当前文件是模块。请考虑改为添加导入。ts(2686)的问题

// 修改tsconfig.json配置
{
  "compilerOptions": {
    "jsx": "react-jsx",
  }
}

```

### 安装 loaders 和 plugins

#### less-loader

```bash
npm install css-loader style-loader less less-loader -D
```

```js
// webpack.config.js

module.exports = {
  module: {
    rules: [
      {
        test: /\.less$/i,
        loader: [
          // compiles Less to CSS
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      }
    ]
  }
};
```

### 反向代理：解决本地开发跨域问题

```js
// webpack.config.js
module.exports = {
  ...,
  devServer: {
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

```
