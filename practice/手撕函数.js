const { reject } = require("delay")
const { tree } = require("gulp")

/* 防抖 */
const debounce = (fn, time) => {
  let timer = null
  return () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, arguments)
    }, time)
  }
}

/* 节流 */
const throttle = (fn, time) => {
  let flag = true;
  return () => {
    if (!flag) return
    flag = false
    setTimeout(() => {
      fn.apply(this.arguments)

    }, time);
  }
}

/* promise */
class Promise {
  constructor(fn) {
    this.cbs = []

    const resolve = value => {
      setTimeout(() => {
        this.data = value
        this.cbs.forEach(f => f(this.data))
      })
    }

    fn(resolve)
  }

  resolve = onResolve => {
    return new Promise((resolve) => {
      this.cbs.push(() => {
        const res = onResolve(this.data)
        if (res instanceof Promise) {
          res.then(resolve)
        } else {
          resolve(res)
        }
      })
    })
  }
}

/* promise all */
const promiseAll = arr => {
  const ret = []
  let cnt = 0
  return new Promise((resolve, reject) => {
    for (let i = 0; i < arr.length; i++) {
      arr[i].then(value => {
        arr[i] = value
        if (++cnt === arr.length) {
          resolve(ret)
        }
      }, err => {
        reject(err)
      })
    }
  })
}

/* promise race */
const promiseRace = arr => {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < arr.length; i++) {
      arr[i].then(value => {
        resolve(value)
      }, err => {
        reject(err)
      })
    }
  })
}

/* instance of */
const instanceOf = (l, r) => {
  if (typeof l !== Object || l === null) return false
  let proto = Object.getPrototypeOf(l)
  while (true) {
    if (proto === null) return false
    if (proto === r.prototype) return true
    proto = Object.getPrototypeOf(proto)
  }
}

/* bind */
Function.prototype.bind1 = function (ctx, ...args) {
  if (typeof this !== 'function') {
    throw Error('type error')
  }

  const self = this;

  return function F() {
    if (this instanceof F) {
      return new self(...args, ...arguments)
    }
    console.log([...args, ...arguments])
    return self.apply(ctx, [...args, ...arguments])
  }
}


/* curry */
const curry = (fn, arity = fn.length, ...args) =>
  arity <= args.length ? fn(...args) : (...arg) => curry(fn, arity, ...args, arg)

console.log(curry(Math.pow)(2)(10)); // 1024
console.log(curry(Math.min, 3)(10)(50)(2)); // 2

/* JSONP */
let count = 0
 
/**
 * @typedef {Object} JsonpOpts
 * @property {Number} timeout - 超时时间
 * @property {String} name - JSONP参数
 * @property {String} param - JSONP URL参数名
 */
/**
 * jsonp
 * @param {String} url 
 * @param {JsonpOpts} opts
 * @param {(err: string | Error, data) => {}} fn 回调函数 
 */
function jsonp(url, opts, fn) {
  const noop = () => { }

  if (typeof opts === 'function') {
    fn = opts
    opts = {}
  }
  if (!opts) opts = {}

  const target = document.getElementsByTagName('script')[0] || document.head;
  const prefix = opts.prefix || '__jsonp'
  const id = opts.name || (prefix + (count++))
  const param = opts.param || 'callback'
  const timeout = opts.timeout != null ? opts.timeout : 60000;
  let timer


  const cleanup = () => {
    if (script.parentNode) {
      script.parentNode.removeChild(script)
    }
    window[id] = noop
  }

  const cancel = () => {
    if (window[id]) {
      cleanup()
    }
  }

  if (timeout) {
    timer = setTimeout(() => {
      cleanup()
      if (fn) fn(new Error('Timeout'))
    }, timeout)
  }

  window[id] = data => {
    cleanup()
    if (fn) fn(null, data)
  }

  // add qs component
  url += (~url.indexOf('?') ? '&' : '?') + `param=${encodeURIComponent(id)}`
  url = url.replace('?&', '?')

  const script = document.createElement('script')
  script.src = url
  target.parentNode.insertBefore(script, target)

  return cancel
}

/* ajax */
const getJSON = (url) => {
  return new Promise((resolve, reject) => {
    /** @type {XMLHttpRequest} */
    const xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Mscrosoft.XMLHttp')
    xhr.open('GET', url, false)
    xhr.sendRequestHeader('Accept', 'application/json')
    xhr.onreadystatechange = () => {
      if(xhr.readyState !== 4) return;
      if(xhr.status === 200 || xhr.status === 304) {
        resolve(xhr.responseText)
      } else {
        reject(new Error(xhr.responseText))
      }
    }
    xhr.send()
  })
}

/* 图片懒加载 */
function lazyLoad() {
  const images = document.getElementsByTagName('img')
  const len = images.length
  // 窗口高度
  const viewHeight = document.documentElement.clientHeight
  // 滚动条高度
  const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop;

  for(const image of images) {
    const offsetHeight = image.offsetTop
    if(offsetHeight < screenTop + viewHeight) {
      image.src = image.dataset.src
    }
  }
}
window.addEventListener('scroll', lazyLoad);
