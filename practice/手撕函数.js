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
        if(res instanceof Promise) {
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
    for(let i = 0; i < arr.length; i++) {
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
    for(let i = 0; i < arr.length; i++) {
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
  if(typeof l !== Object || l === null) return false
  let proto = Object.getPrototypeOf(l)
  while(true) {
    if(proto === null) return false
    if(proto === r.prototype) return true
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
    if(this instanceof F) {
      return new self(...args, ...arguments)
    }
    console.log( [...args, ...arguments])
    return self.apply(ctx, [...args, ...arguments])
  }
}


/* curry */
const curry = (fn, arity = fn.length, ...args) =>
  arity <= args.length ? fn(...args) : (...arg) => curry(fn, arity, ...args, arg)

console.log(curry(Math.pow)(2)(10)); // 1024
console.log(curry(Math.min, 3)(10)(50)(2)); // 2