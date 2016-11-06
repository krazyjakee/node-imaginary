var request = require('./request')

class Imaginary {

  constructor(image, url) {
    this.url = url
    this.image = image
    this.params = {}
    this.server = this.balance
  }

  balance(url, http_params = {}) {
    this.url = url
    this.http_params = http_params
    return this
  }

  image(image) {
    this.image = image
    return this
  }

  key(key) {
    this.params.key = key
    return this
  }

  imageUrl(url) {
    this.params.url = url
    return this
  }

  params(params) {
    Object.assign(this.params, params)
    return this
  }

  crop(params, cb) {
    return this.process('crop', params, cb)
  }

  convert(params, cb) {
    return this.process('convert', params, cb)
  }

  resize(params, cb) {
    return this.process('resize', params, cb)
  }

  enlarge(params, cb) {
    return this.process('enlarge', params, cb)
  }

  extract(params, cb) {
    return this.process('extract', params, cb)
  }

  info(params, cb) {
    return this.process('info', params, cb)
  }

  embed(params, cb) {
    return this.process('embed', params, cb)
  }

  rotate(params, cb) {
    return this.process('rotate', params, cb)
  }

  flip(params, cb) {
    return this.process('flip', params, cb)
  }

  flop(params, cb) {
    return this.process('flop', params, cb)
  }

  thumbnail(params, cb) {
    return this.process('thumbnail', params, cb)
  }

  zoom(params, cb) {
    return this.process('zoom', params, cb)
  }

  watermark(params, cb) {
    return this.process('watermark', params, cb)
  }

  health(cb) {
    this.params.get = true
    return this.process('health', null, cb)
  }

  versions(cb) {
    this.params.get = true
    return this.process('', null, cb)
  }

  objectives(obj) {
    return new Promise((accept, reject) => {
      let objectives = []
      let callback = null
      let count = 0
      console.log(obj)
      for([key, value] in obj){
        count++
        console.log(count, Object.keys(obj).length)
        if(count == Object.keys(obj).length){
          objectives.push(this.process(key, value, (err, res) => {
            if(err){
              reject(err)
            }
            accept(res)
          }, true))
        }else{
          objectives.push(this.process(key, value, null, true))
        }
      }
      objectives.reduce((prev, cur) => prev.then(cur))
    })
  }

  process(action, params, cb, promise) {
    var baseUrl = this.url

    if (!baseUrl) {
      throw new Error('Missing imaginary server URL')
    }

    if (Array.isArray(baseUrl)) {
      baseUrl = permute(baseUrl)
    }

    var opts = {
      params: Object.assign({}, this.params, params),
      http_params: this.http_params
    }
    if(promise){
      return request_promise(`${baseUrl}/${action}`, opts, this.image, cb)
    }else{
      return request(`${baseUrl}/${action}`, opts, this.image, cb)
    }
  }
}

var permute = arr => {
  let item = arr.shift()
  arr.push(item)
  return item
}

module.exports = Imaginary
