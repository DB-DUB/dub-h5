const dotenv = require('dotenv')
const path = require('path')

const nowEnv = process.env.NODE_ENV

const envGlobalParams = dotenv.config({ path: path.resolve(__dirname, '../.env') }).parsed
const envGlobalParamsKeys = Object.keys(envGlobalParams).reduce((prev, next) => {
  prev[next] = envGlobalParams[next]
  return prev
}, {})
const envParams = dotenv.config({ path: path.resolve(__dirname, `../.env.${nowEnv}`) }).parsed
const envParamsKeys = Object.assign(envGlobalParamsKeys, Object.keys(envParams).reduce((prev, next) => {
  prev[next] = envParams[next]
  return prev
}, {}))

module.exports = {
  ...envParamsKeys
}
