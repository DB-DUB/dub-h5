import axios from 'axios'
import { addCanceler, getKey, removeCanceler } from './cancel-token'
// import { addCanceler, cancelAll, getKey, removeCanceler } from './cancel-token'

import { RequestErr } from '@/utils/CustomErr'

// create an axios instance
const service = axios.create({
  baseURL: '/api', // url = base url + request url
  timeout: 8000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // store all request canceler
    config.cancelToken = new axios.CancelToken(fn => {
      addCanceler(config, fn)
    })

    // do something before request is sent
    const version = process.env.GLOBAL_VERSION
    const headerObj = {
      'web-version': version
    }
    for (const i in headerObj) {
      config.headers[i] = headerObj[i]
    }
    return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const cancelKey = getKey(response.config)
    removeCanceler(cancelKey)
    const url = response.config.url || ''
    if (/^\/questions/.test(url)) {
      return response.data
    } else {
      const { data, code } = response.data
      if (code === 10000) {
        return data
      } else {
        const customErr = new RequestErr(response)
        sentry.captureException(customErr)
        return Promise.reject(response.data)
      }
    }
  },
  error => {
    const { response, config } = error
    if (response && response?.data) {
      const { code = 0 } = response.data

      const cancelKey = getKey(config)
      removeCanceler(cancelKey)

      if (code) {
        const customErr = new RequestErr(response)
        sentry.captureException(customErr)
      } else {
        // something went wrong
      }
      return Promise.reject(response.data)
    } else {
      if (error.message === 'Network Error') {
        console.log('Network Error')
      } else if (error.message.includes('timeout')) {
        console.log('Timeout')
      } else if (axios.isCancel() || error.message === 'Request aborted') {
        console.log('The request has been aborted')
      } else {
        console.log('Other error')
      }
      const customErr = new RequestErr(error)
      sentry.captureException(customErr)
    }
    return Promise.reject(error)
  }
)
export default service
