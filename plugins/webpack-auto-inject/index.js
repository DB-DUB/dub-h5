const path = require('path')

// Reference
// https://github.com/benfangdesaozhu/vconsole-webpack5-plugin/blob/master/index.js
// https://github.com/diamont1001/vconsole-webpack-plugin/blob/master/index.js

class WebpackAutoInjectPlugin {
  constructor(options) {
    this.options = Object.assign({
      filter: []
    }, options)
  }
  apply(compiler) {
    const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)
    // Only for webpack5, not support webpack4
    compiler.hooks.entryOption.tap('autoInjectPlugin', (compilation, entry) => {
      // console.log('console:', compilation, entry)
      // when entry is string or string[], transform to entry: { main: { import: string[] } }
      // when entry is object, transform to entry: { entryKey: { import: string[] } }
      if (Object.prototype.toString.call(entry) === '[object Object]') {
        for (let key in entry) {
          if (entry[key].import && Object.prototype.toString.call(entry[key].import) === '[object Array]') {
            // inject vConsole (not for production and not use pages)
            if (!IS_PROD && !this.options.filter.noVconsole.includes(key)) {
              entry[key].import.push(path.resolve(__dirname, "vconsole.js"))
            }
          }
        }
      }
    })
  }
}

module.exports = WebpackAutoInjectPlugin