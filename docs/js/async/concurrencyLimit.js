const results = [];
const timeout = i =>
  new Promise(resolve =>
    setTimeout(() => {
      results.push(i);
      resolve();
    }, i)
  ).then(() => {
    return i
  });

const urls = [100, 500, 300, 200]

// ====== 1.
// async function main() {
//   for(let i = 0; i < urls.length; i += 2) {
//     await Promise.all(urls.slice(i, i + 2).map(_ => timeout(_)))
//   }
//   console.log(results)
// }
// main()

// ====== 2.
// function limitRun() {
//   let index = 0, cnt = 0; // 计数君
//   let idx = 2; // 通道数
//   function _request() {
//     while(idx > 0 && cnt < 3) {
//       const item = urls[index++] // 取出一个用于请求
//       idx-- // 占用通道
//       timeout(item)
//       .finally(() => { // 注册一个回调函数，做上面提到的两件事
//         cnt++ // 计数+1
//         idx++ // 释放通道
//         if (cnt === 4) {
//           // 2. 如果发现执行完毕（此处应该有一个计数，统计当前已经请求完毕），那么不再取出数据并且决议完成（或者执行完成后的回调）
//           // do something..
//           console.log('执行完毕', results)
//         } else {
//           // 1. 如果发现待执行的队列还有需要执行的，把它放入队列（如 `1` 执行完后就应当把 `3` 放入）
//           _request() // 递归执行
//         }
//       })
//     }
//   }
//   _request()
// }
// limitRun()

class LimitPool {
  constructor(max) {
    this._max = max
    this._idle = 0
    this._queue = []
  }

  call(fn, ...args) {
    return new Promise((resolve, reject) => {
      const task = this._createTask(fn, args, resolve, reject)
      if(this._idle >= this._max) {
        // 大于目前通道数 放入队列中
        this._queue.push(task)
      } else {
        task()
      }
    })
  }

  _createTask(fn, args, _resolve, _reject) {
    // 惰性计算 如果返回，会直接计算fn，Promise的构造函数是直接运行的，不会异步执行
    return () => {
      fn(...args)
      .then(_resolve)
      .catch(_reject)
      .finally(() => {
        this._idle--
        if (this._queue.length) {
          const task = this._queue.shift()
          task()
        } else {
          // console.log('队列清空完毕')
        }
      })
      this._idle++
    }
  }
}

const limitPool = new LimitPool(2)
for(let i of urls) {
  console.log(i)
  limitPool.call(timeout, i).then(() => console.log(results))
}