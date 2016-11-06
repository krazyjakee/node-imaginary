var fs = require('fs')
var stream = require('stream')
var http = require('request')

var request = (url, params, body, cb) => {
  var requester = doRequest(url, params, cb)

  if (params.url || params.get) {
    return requester('GET')
  }

  return read(body).pipe(requester('POST'))
}

var doRequest = (url, qs, cb = (() => false)) => {
  return method => {
    var handler = (err, res) => {
      // Check server response
      if (res && res.statusCode >= 400) {
        err = new Error('Invalid server response: ' + res.statusCode)
        req.emit('error', err, res)
      }
      cb(err, res)
    }

    return http({
      url,
      qs,
      method,
      strictSSL: false
    }, handler)
  }
}

var read = image => {
  if (typeof image === 'string') {
    return readFromString(image)
  }

  if (isStream(image) === false) {
    throw new TypeError('Image should be a string or readable stream')
  }

  return image
}

var readFromString = image => isUrl(image) ? http(image, { strictSSL: false }) : fs.createReadStream(image)

var isStream = obj => obj instanceof stream.Stream

var isUrl = str => /^http[s]?/i.test(str)

module.exports = request
