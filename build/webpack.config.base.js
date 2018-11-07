const path = require('path')
const webpack = require('webpack')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')

const rootPath = path.resolve(__dirname, '..') // 项目根目录
const src = path.join(rootPath, 'src') // 开发源码目录
const env = process.env.NODE_ENV.trim() // 当前环境
const commonPath = {
  CDN_PATH: '/static/', // 静态资源目录
  rootPath,
  dist: path.join(rootPath, 'dist'), // build 后输出目录
  indexHTML: path.join(src, 'index.html'), // 入口基页
  staticDir: path.join(rootPath, 'static') // 无需处理的静态资源目录
}

module.exports = {
  commonPath,

  // webpack主要公共配置
  config: {
    // 环境
    mode: env,

    entry: { app: path.join(src, 'index.js') },
    output: {
      path: path.join(commonPath.dist, 'static'),
      publicPath: commonPath.CDN_PATH + 'static/'
    },
    resolve: {
      // 针对 Npm 中的第三方模块优先采用 jsnext:main 中指向的 ES6 模块化语法的文件
      mainFields: ['jsnext:main', 'browser', 'main'],

      alias: {
        // ================================
        // 自定义路径别名
        // ================================
        src,
        assets: path.join(src, 'assets'),
        images: path.join(src, 'assets/images'),
        static: path.join(rootPath, 'static')
      }
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          }
        },
        {
          test: /\.html$/,
          loader: 'html-loader'
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/,
          loader: 'url-loader',
          options: {
            limit: 10240, // 10KB 以下使用 base64
            name: 'img/[name]-[hash:6].[ext]'
          }
        }
      ]
    },
    plugins: [
      new ProgressBarPlugin(), // 进度条
      new webpack.DefinePlugin({
        // ================================
        // 配置开发全局常量
        // ================================
        __DEV__: env === 'development',
        __PROD__: env === 'production'
      })
    ]
  }
}
