// function Promise(fn) {
//   this.cbs = []

//   // 决议成功，顺序执行注册的回调
//   const resolve = value => {
//     setTimeout(() => {
//       this.data = value
//       this.cbs.forEach(cb => cb(value))
//     })
//   }
  
//   fn(resolve.bind(this))
// }

// Promise.prototype.then = function (onResolve) {
//   return new Promise(resolve => {
//     this.cbs.push(() => {
//       const res = onResolve(this.data)
//       if (res instanceof Promise) {
//         res.then(resolve)
//       } else {
//         resolve(res)
//       }
//     })
//   })
// }

class Promise {
  constructor(fn) {
    this.cbs = []
    const resolve = value => {
      setTimeout(() => {
        this.data = value
        this.cbs.forEach(f => f(value))
      })
    }

    fn(resolve)
  }

  then = (onResolve) => {
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



new Promise((resolve) => {
  setTimeout(() => {
    resolve(1);
  }, 500);
})
  .then((res) => {
    console.log(res);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(2);
      }, 500);
    }).then(res => {
      console.log('user then promise', res)
      return 3
    });
  })
  .then(console.log);