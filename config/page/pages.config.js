const WebpackCdnPlugin = require('../../plugins/html-webpack-cdn-plugin')
const WebpackPrefetchPlugin = require('../../plugins/html-webpack-prefetch-plugin')
const WebpackAutoInjectPlugin = require('../../plugins/webpack-auto-inject')
const assetsCDN = require('../cdn.config')
const pluginConfig = require('../plugin.config')

const sharePages = require('./modules/share')

const pages = [
  ...sharePages
]


module.exports = [
  new WebpackAutoInjectPlugin({
    filter: pluginConfig
  }),
  ...pages,
  new WebpackCdnPlugin({
    modules: {
      'vue': [
        { name: 'vue', var: 'Vue', prodUrl: assetsCDN.js.vue },
      ],
      'axios': [
        { name: 'axios', var: 'axios', prodUrl: assetsCDN.js.axios },
      ],
      'dayjs': [
        { name: 'dayjs', var: 'dayjs', prodUrl: assetsCDN.js.dayjs },
      ],
      'vconsole': [
        { name: 'vconsole', var: 'VConsole', prodUrl: assetsCDN.js.vconsole },
      ]
    }
  }),
  new WebpackPrefetchPlugin({})
]
