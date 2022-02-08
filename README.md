# react-webpack-base

从零开始搭建 React 基础框架

## 一、技术选型

webpack 5 + react17 + typescript + react-router-dom v6

- 常用命令

```bash
# 开发
npm run start

# 生产打包
npm run build

# 包体积大小分析
npm run analyzer

```

- 规范化代码风格

参考 [prettierrc-best](https://github.com/luozyiii/prettierrc-best)

## 二、webpack 配置、loaders 和 plugins

### 1. 基本配置

- 安装

```bash
# webpack：用于编译 JavaScript 模块； webpack-cli：用于在命令行中运行 webpack
npm install webpack webpack-cli -D
```

- webpack 配置拆分

```bash
webpack.common.js    # 公共
webpack.dev.js       # 开发
webpack.prod.js      # 生产
webpack.analyzer.js  # 包体积大小分析
```

- webpack-dev-server：在本地起一个 http 服务

```bash
# 安装
npm install webpack-dev-server -D

# package.json 配置 scripts
"serve": "webpack serve"
```

- 反向代理：解决本地开发跨域问题

```js
// webpack.config.js
module.exports = {
  ...,
  devServer: {
    port: 9000,
    historyApiFallback: true, // history 路由
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

### 2. loader

- less-loader : 处理 css 文件打包

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

### 3. plugins

- html-webpack-plugin: 用于打包 html 文件

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

- simple-progress-webpack-plugin: 观察打包进度

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

- webpack-merge：用于合并 webpack 公共配置

```js
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production'
});
```

- webpack-bundle-analyzer：包体积大小分析

[npm](https://www.npmjs.com/package/webpack-bundle-analyzer)

```js
// webpack.analyzer.js 包体积大小分析

const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(common, {
  mode: 'production',
  plugins: [new BundleAnalyzerPlugin()]
});
```

## 三、TypeScript 支持

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

## 四、react 支持

### 1. react 和 react-dom

```bash
npm install react react-dom
```

### 2. react-router-dom v6

- react-loadable 按需加载(研究)

[参考文档](https://reactrouter.com/docs/en/v6/getting-started/overview)

- 依赖安装

```bash
# react-router-dom
npm install react-router-dom
# types
npm i -D @types/react-router-dom
```

#### 约定式路由（去中心化）

- 1.最简单的情况

```js
// 以下目录结构
└── pages
    ├── index.tsx
    ├── login
    |      └── index.tsx
    └── 404.tsx

// 会得到以下配置的路由
[
  {path: '/', element: '@/pages/index'},
  {path: '/login', element: '@/pages/login/index'},
  {path: '/404', element: '@/pages/404'},
]
```

- 2.动态路由

```js
约定 `[]` 包裹的文件或文件夹为动态路由。
src/pages/invoice/[id].tsx 会成为 /invoice/:id

// 以后再考虑
src/pages/invoice/[id]/settings.tsx 会成为 /invoice/:id/settings
```

## 五、抽离 API 层，二次封装 axios

- 第一步：确定想要的效果

```js
api.user.loginIn(params).then(() => {});
```

- 目录结构, 具体实现可看源码; 为了防止接口被更改，使用了 Object.freeze

```bash
├── src # 源码目录
│   │── api                     # 接口目录
│   │   │── index.ts            # 暴露出去的访问入口
│   │   │── shop.ts             # shop 模块的接口
│   │   └── user.ts             # user 模块的接口
│   └── services                # services 层
│       │── index.ts            # 请求库(axios) 的二次封装
│       └── config.ts           # config 配置
```

- 优化前: src/api/index.ts

```js
import services from '@/services';
import user from './user';
import shop from './shop';

const modelsFile = require.context('@/api', true, /.ts$/);

const models = modelsFile.keys().map((v) => {
  console.log('v:', v);
  return modelsFile(v);
});
console.log(models);

const api: any = {};

// 注册模块方法
function register(name: string, module: any) {
  api[name] = {};
  for (const key in module) {
    let options = module[key];
    let method = options.method;
    api[name][key] = (params: any) => {
      if (method === 'get') {
        options.params = params;
      } else {
        options.data = params;
      }
      return services.request({ ...options });
    };
  }
  // 冻结对象，不允许修改
  Object.freeze(api[name]);
}

// 注册 或者使用require.context 自动导入注册
register('user', user);
register('shop', shop);

Object.freeze(api);

export default api;
```

- 优化: 使用 require.context 批量导入接口

```bash
npm i @types/webpack-env @types/node -D
```

```js
// src/api/index.ts
import services from '@/services';

const moduleFiles = require.context('@/api', true, /.ts$/);

let moduleKeys = moduleFiles.keys().filter((v) => v !== './index.ts');

const api: any = {};

// 注册模块方法
function register(name: string, module: any) {
  api[name] = {};
  for (const key in module) {
    let options = module[key];
    let method = options.method;
    api[name][key] = (params: any) => {
      if (method === 'get') {
        options.params = params;
      } else {
        options.data = params;
      }
      return services.request({ ...options });
    };
  }
  // 冻结对象，不允许修改
  Object.freeze(api[name]);
}

// 自动注册
moduleKeys.forEach((v) => {
  console.log(moduleFiles(v).default);
  let keys = v.split('.')[1].slice(1);
  if (keys) register(`${keys}`, moduleFiles(v).default);
});

Object.freeze(api);

export default api;
```

## 遗留问题

- react-router-dom v6 懒加载 和分包问题待解决
