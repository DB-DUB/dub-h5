// data masking for token
export function filterToken(token) {
  return token && token.toString() ? token.toString().replace(/^(Bearer .{4}).*(.{4})$/, '$1****$2') : ''
}

// data masking if contains password or token
export function filterRequestData(data, filterFlag = false) {
  // the keys that need to be filtered
  const filteredKeys = ['password', 'authorization']

  // Number, String, Boolean, Null, Undefined, Symbol, Function
  const dataTypes = ['number', 'string', 'boolean', 'undefined', 'symbol', 'function']
  const dataType = typeof data
  if (dataTypes.includes(dataType)) {
    if (filterFlag) {
      return '[Filtered]'
    } else {
      return data
    }
  }

  // null
  if (data === null) {
    if (filterFlag) {
      return '[Filtered]'
    } else {
      return null
    }
  }

  // Array, Object
  const constructor = data.constructor
  const result = new constructor()
  if (Array.isArray(data)) { // Array
    for (let i = 0, length = data.length; i < length; i++) {
      result[i] = filterRequestData(data[i], filterFlag)
    }
  } else { // Object
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const flag = filteredKeys.includes(key.toLowerCase())
        result[key] = filterRequestData(data[key], flag)
      }
    }
  }
  return result
}
