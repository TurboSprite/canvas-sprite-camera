const webpack = require('webpack')
const express = require('express')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const baseConfig = require('./webpack.config.base').config
const config = require('./webpack.config.dev')

let app = express()

app.use('/static', express.static('static'))

let compiler = webpack(config)

app.use(
  webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: baseConfig.output.publicPath
  })
)

app.use(webpackHotMiddleware(compiler))

app.listen(8000, '127.0.0.1', err => {
  err && console.log(err)
})
