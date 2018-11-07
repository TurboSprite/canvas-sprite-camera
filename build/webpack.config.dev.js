const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const baseConfig = require('./webpack.config.base')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const rucksack = require('rucksack-css')
const autoprefixer = require('autoprefixer')
const config = baseConfig.config
const commonPath = baseConfig.commonPath

const cssRules = [
  'css-hot-loader',
  MiniCssExtractPlugin.loader,
  'css-loader',
  {
    loader: 'postcss-loader',
    options: {
      plugins: [
        rucksack(),
        autoprefixer({
          browsers: ['last 2 versions', '> 5%'],
          env: 'Android, and_chr, ios_saf, op_mob, and_qq, and_uc, and_ff'
        })
      ]
    }
  }
]

config.output.publicPath = '/'
config.output.filename = '[name].js'
config.output.chunkFilename = '[id].js'

config.devtool = 'cheap-module-eval-source-map'

// add hot-reload related code to entry chunk
config.entry.app = [
  'webpack-hot-middleware/client?reload=true',
  // 为热替换（HMR）打包好运行代码
  // only- 意味着只有成功更新运行代码才会执行热替换（HMR）
  'webpack/hot/only-dev-server',
  config.entry.app
]

config.module.rules.push(
  {
    test: /\.css$/,
    use: ['style-loader', ...cssRules]
  },
  {
    test: /\.less$/,
    use: ['style-loader', ...cssRules, 'less-loader']
  }
)

config.plugins.push(
  // 开启全局的模块热替换（HMR）
  new webpack.HotModuleReplacementPlugin(),

  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: commonPath.indexHTML,
    chunksSortMode: 'dependency'
  }),
  new MiniCssExtractPlugin({ filename: '[name].css' }),
  new BrowserSyncPlugin(
    {
      host: '127.0.0.1',
      open: false,
      port: 8000,
      proxy: 'http://127.0.0.1:8000/',
      logConnections: false,
      browser: 'google chrome'
    },
    { reload: false }
  )
)

module.exports = config
