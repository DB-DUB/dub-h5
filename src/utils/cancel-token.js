const cancelers = {}

export const getKey = (config) => {
  return `${config?.url}:${config?.method}`
}

export const addCanceler = (config, fn) => {
  const key = getKey(config)
  cancelers[key] = fn
  // console.log('cancelers', cancelers)
}

export const removeCanceler = (key) => {
  delete cancelers[key]
}

// cancel single request
export const cancelRequest = (key) => {
  const fn = cancelers[key]
  if (!fn) return
  fn()
  removeCanceler(key)
}

// cancel all request
export const cancelAll = () => {
  for (const k in cancelers) {
    if (Object.hasOwnProperty.call(cancelers, k)) {
      cancelRequest(k)
    }
  }
}
