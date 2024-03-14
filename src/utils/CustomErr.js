import { filterToken, filterRequestData } from '@/utils/pipe'

export class CustomErr extends Error {
  constructor(name, message) {
    super(Error)
    this.name = name || 'MyError'
    this.message = message || 'Default Message'
    this.stack = (new Error()).stack
  }
}

export class RequestErr extends CustomErr {
  constructor(error) {
    super(CustomErr)
    this.name = 'Request Error'
    let requestData
    const errorData = error?.config?.data
    try {
      requestData = JSON.parse(errorData.toString())
    } catch {
      requestData = errorData
    }
    if (error?.response) {
      this.message = error ? {
        request: {
          type: error?.config?.type,
          url: error?.config?.url,
          params: error?.config?.params,
          headers: filterRequestData(error?.config?.headers),
          Authorization: filterToken(error?.config?.headers?.Authorization),
          data: filterRequestData(requestData)
        },
        response: {
          status: error?.response?.status,
          statusText: error?.response?.statusText || error?.message,
          body: error?.response?.data
        }
      } : 'Default Message'
    } else {
      this.message = error ? {
        request: {
          type: error?.config?.type,
          url: error?.config?.url,
          params: error?.config?.params,
          headers: filterRequestData(error?.config?.headers),
          Authorization: filterToken(error?.config?.headers?.Authorization),
          data: filterRequestData(requestData)
        },
        error: {
          code: error?.code,
          name: error?.name,
          message: error?.message
        }
      } : 'Default Message'
    }
    console.log('Request error msg:', this.message, error)
  }
}
