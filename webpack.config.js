const path = require('path')

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

const ESLintPlugin = require('eslint-webpack-plugin')

const webpack = require('webpack')
const dotenv = require('dotenv')

const SentryWebpackPlugin = require("@sentry/webpack-plugin")

const TerserPlugin = require("terser-webpack-plugin")

const entriesConfig = require('./config/entry/entry.config')
const pagesConfig = require('./config/page/pages.config')

module.exports = env => {
  const envGlobalParams = dotenv.config({ path: `.env` }).parsed
  const envGlobalParamsKeys = Object.keys(envGlobalParams).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(envGlobalParams[next])
    return prev
  }, {})
  const envParams = dotenv.config({ path: `.env.${env.NODE_ENV}` }).parsed
  const envParamsKeys = Object.assign(envGlobalParamsKeys, Object.keys(envParams).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(envParams[next])
    return prev
  }, {}))

  const IS_PROD = ['production', 'prod'].includes(env.NODE_ENV)
  const NOT_DEV = !['dev', 'development'].includes(env.NODE_ENV)
  const sentryPlugins = []
  const cleanPlugins = []
  const HINTS = IS_PROD ? 'error' : 'warning'
  
  if (IS_PROD) {
    sentryPlugins.push(
      new SentryWebpackPlugin({
        release: process.env.SENTRY_PROJECT + '@' + process.env.GLOBAL_VERSION,
        include: './dist/js/',
        ignore: ['node_modules', 'webpack.config.js'],
        urlPrefix: '~/js/',
        ext: ['map']
      })
    )
  }

  if (NOT_DEV) {
    cleanPlugins.push(
      new CleanWebpackPlugin({
        cleanStaleWebpackAssets: true
      })
    )
  }

  return {
    devtool: 'source-map',
    mode: 'production',
    cache: {
      type: 'filesystem'
    },
    entry: entriesConfig,
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'js/[name].[contenthash].js',
      libraryTarget: 'umd',
      clean: NOT_DEV,
      publicPath: '/',
      environment: {
        // The environment supports arrow functions ('() => { ... }').
        arrowFunction: false,
        // The environment supports BigInt as literal (123n).
        bigIntLiteral: false,
        // The environment supports const and let for variable declarations.
        const: false,
        // The environment supports destructuring ('{ a, b } = obj').
        destructuring: false,
        // The environment supports an async import() function to import EcmaScript modules.
        dynamicImport: false,
        // The environment supports 'for of' iteration ('for (const x of array) { ... }').
        forOf: false,
        // The environment supports ECMAScript Module syntax to import ECMAScript modules (import ... from '...').
        module: false
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        crypto: false
      }
    },
    performance: {
      hints: HINTS,
      maxEntrypointSize: 50000000,
      maxAssetSize: 30000000,
      assetFilter: function(assetFilename) {
        return assetFilename.endsWith('.js')
      }
    },
    devServer: {
      compress: true,
      hot: true,
      open: true,
      port: 9100,
      proxy: {
        "/api": {
          target: "https://api.demo.com",
          secure: false,
          changeOrigin: true
        }
      },
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET'
      }
    },
    module: {
      rules: [
        {
          test: /\.css/i,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader'
          ]
        },
        {
          test: /\.less$/i,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'less-loader',
              options: {
                additionalData: `@env: ${env.NODE_ENV};`
              }
            },
            'postcss-loader'
          ]
        },
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader'
        },
        {
          test: /\.(png|jpg|gif|svg)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'imgs/[name].[contenthash][ext]'
          }
        },
        {
          test: /\.(woff|ttf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name].[contenthash][ext]'
          }
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin(envParamsKeys),
      ...cleanPlugins,
      new CopyPlugin({
        patterns: [
          { from: 'public', to: '' },
          { from: 'src/script', to: 'script' }
        ]
      }),
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash].css'
      }),
      new ESLintPlugin({
        fix: false,
        extensions: ['js'],
        exclude: 'node_modules'
      }),
      ...sentryPlugins,
      ...pagesConfig
    ],
    optimization: {
      minimize: NOT_DEV,
      minimizer: [
        // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
        // `...`,
        new TerserPlugin({
          terserOptions: {
            format: {
              comments: false
            }
          },
          extractComments: false // remove license.txt
        }),
        new CssMinimizerPlugin()
      ]
    }
  }
}