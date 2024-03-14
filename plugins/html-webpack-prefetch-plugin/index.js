const HtmlWebpackPlugin = require('html-webpack-plugin')

// Reference
// https://github.com/principalstudio/html-webpack-inject-preload/tree/master
// https://github.com/jantimon/resource-hints-webpack-plugin/tree/master

class WebpackPrefetchPlugin {
  constructor(options) {
    this.options = Object.assign({}, options)
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('WebpackPrefetchPlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync(
        'WebpackPrefetchPlugin',
        (data, callback) => {
          const publicPath = typeof compiler.options.publicPath === 'string' ? compiler.options.publicPath : '/'
          const assets = Object.keys(compilation.assets)
          const prefetch = Array.isArray(data.plugin.userOptions.prefetch) ? data.plugin.options.prefetch : []
          const addPrefetch = []
          prefetch.forEach(match => {
            const asset = assets.find(asset => new RegExp(match).test(asset))
            if (asset) {
              addPrefetch.push(publicPath + asset)
            } else {
              addPrefetch.push(publicPath + match)
            }
          })
          data.headTags = data.headTags.concat(addPrefetch.map(url => {
            return {
              tagName: 'link',
              attributes: {
                rel: 'prefetch',
                href: url
              }
            }
          }))
          callback(null, data)
        }
      )
    })
  }
}

module.exports = WebpackPrefetchPlugin
