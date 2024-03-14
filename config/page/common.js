const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')

const assetsCDN = require('../cdn.config')
const pluginConfig = require('../plugin.config')

const IS_PROD = ['production', 'prod'].includes(process.env.ENV)
const vconsoleFlag = !IS_PROD

const envKeys = require('../getEnvConfig')

const basePlugin = {
  minify: {
    collapseWhitespace: true,
    keepClosingSlash: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
    minifyCSS: true,
    minifyJS: true
  },
  envKeys,
  vconsoleFlag,
  favicon: path.resolve(__dirname, '../../public/favicon.ico'),
  cdnModules: ['vue', 'axios'],
  chunks: [],
  meta: {
    'charset': {
      charset: 'UTF-8'
    },
    'UACompatible': {
      'http-equiv': 'X-UA-Compatible',
      content: 'IE=edge'
    },
    'nocache': {
      'http-equiv': 'pragma',
      content: 'no-cache'
    },
    'format-detection': {
      name: 'format-detection',
      content: 'telephone=no'
    },
    'viewport': {
      name: 'viewport',
      content: 'initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
    }
  },
  prefetch: []
}

const newPage = (config) => {
  const pageConfig = {
    ...basePlugin,
    ...config,
    meta: {
      ...basePlugin.meta,
      ...config.meta
    }
  }
  const chunks = Array.isArray(pageConfig.chunks) ? pageConfig.chunks : []
  const noVconsoleFlag = chunks.some(entry => pluginConfig.noVconsole.includes(entry))
  pageConfig.vconsoleFlag = !IS_PROD && !noVconsoleFlag
  console.log('pageConfig:', pageConfig.chunks, ', vconsole: ', pageConfig.vconsoleFlag)
  return new HtmlWebpackPlugin(pageConfig)
}

module.exports = {
  assetsCDN,
  basePlugin,
  envKeys,
  newPage
}