# js异步初探 - 图解并发控制

## 前言
本篇起因源一个问题，Promise.all的限制并发数是多少？

这个可以通过 `V8` 的[测试用例](https://github.com/v8/v8/blob/4b9b23521e6fd42373ebbcb20ebe03bf445494f9/test/mjsunit/es6/promise-all-overflow-1.js#L9-L12)得知这个数字不超过 `2097151`：

```js
const a = new Array(2 ** 21 - 1);
const p = Promise.resolve(1);
for (let i = 0; i < a.length; ++i) a[i] = p;
testAsync(assert => {
  assert.plan(1);
  Promise.all(a).then(assert.unreachable, reason => {
    assert.equals(true, reason instanceof RangeError);
  });
});
```

平时在社区中，我们也偶尔会看到这样一道题：

> 请实现如下函数，可以批量请求数据,所有的 url 地址在 urls 参数中，同时可以通过 max 参数控制请求的并发数，当所有请求结束之后，需要执行 callback 回调函数，发送请求的函数可以直接使用 fetch 即可

这道题我们发现，发送请求的函数使用 `fetch` 可知这是在在浏览器环境中；浏览器其实对同一域名的并发数量有所限制，比如 `Chrome` 就限制了 `6` 个，所以这里的 `max` 我们可以认为是不超过 `10` 个。解决这类限制我们可以通过多域名的形式优化。

以目前的网络环境，我们恨不得增加浏览器的单域名并发请求上限。这么看来这道题的实用性很小喽？

然而，在工作中遇到了一个这样问题，让我发现这题有它的应用场景。

> 发送邮件和IM消息需要调用三方提供的API接口，而这个接口分别限制了150/min和600/min的上限

假设我们不作限制，直接使用 `promise.all` 实例化所有的消息发起请求，假设接口请求返回时间是 `1s` 的话， 直接突破了 `6 * 60 > 150`  的限制导致后续的请求失效。

首先我们定制一个测试用例，限制并发数 `limit` 为 `2`

```js
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
```
那么执行之后会有以下两个结果：

1. 如果没有限制成功，得到的结果应该是 `[100, 200, 300, 500]`
2. 如果限制并发数成功，得到的结果应该是 `[100, 300, 500, 200]`

如图所示
![](https://github.com/hemisu/code-snippet-practice/blob/master/docs/js/async/img/1.测试用例.png)


## 尝试1. 失败的第一次
我们可以利用 `Promise.all` 配合 `ES7` 的 `async` 语法实现一个简单的并发限制

```js
async function main() {
  for(let i = 0; i < urls.length; i += 2) {
    await Promise.all(urls.slice(i, i + 2).map(_ => timeout(_)))
  }
  console.log(results)
}
main()

// Array(4) [100, 500, 200, 300]
```

执行得到的结果是 `Array(4) [100, 500, 200, 300]`，和我们前面提到的不符鸭，画个图康康


![](https://github.com/hemisu/code-snippet-practice/blob/master/docs/js/asyncimg/2.简单实现.png)

很显然，这个是不符合我们要求的；我们不可能等到这两个通道里最晚的执行完毕后再发起下一波请求。

## 尝试2. 限制通道数

既然我们需要在 `100` 执行完后立刻放入下一个 `500`，我们就需要抛弃这个 `Promise.all` 来进行一次尝试了

这里我们可以假想有 `2` 个通道，开始时我们先填满这 `2` 个通道，然后我们对其中运行的 `1` 和 `5` 注册一个回调函数，它可以做以下两件事：

1. 如果发现待执行的队列还有需要执行的，把它放入队列（如 `1` 执行完后就应当把 `3` 放入）
2. 如果发现执行完毕（此处应该有一个计数，统计当前已经请求完毕），那么不再取出数据并且决议完成（或者执行完成后的回调）

```js
function limitRun() {
  let index = 0, cnt = 0; // 计数君
  let idx = 2; // 通道数
  function _request() {
    while(idx > 0 && cnt < 3) {
      const item = urls[index++] // 取出一个用于请求
      idx-- // 占用通道
      timeout(item)
      .finally(() => { // 注册一个回调函数，做上面提到的两件事
        cnt++ // 计数+1
        idx++ // 释放通道
        if (cnt === 4) {
          // 2. 如果发现执行完毕（此处应该有一个计数，统计当前已经请求完毕），那么不再取出数据并且决议完成（或者执行完成后的回调）
          // do something..
          console.log('执行完毕', results)
        } else {
          // 1. 如果发现待执行的队列还有需要执行的，把它放入队列（如 `1` 执行完后就应当把 `3` 放入）
          _request() // 递归执行
        }
      })
    }
  }
  _request()
}
limitRun()
// Array(4) [100, 300, 500, 200]
```

通过这样的方式，我们第一次得到了正确答案。简单的抽象一下，我们就可以得到一个工具函数。

## 尝试3. 第一次抽象

```js
/**
 * 并发工具函数
 * @param {any[]} queue 待处理队列
 * @param {() => Promise<any>} fn 异步函数，返回一个promise
 * @param {Number} max 并发上限
 * @param {() => any} callback 回调
 */
function sendRequestIdle (queue, fn = () => Promise.resolve(), max = 1, callback) {
  const len = queue.length;
  let idx = 0, cnt = 0;
  function _request() {
    while(idx < len && max > 0) {
      max--
      fn(queue[idx++]).finally(() => {
        max++
        cnt++
        if(len === cnt) {
          return callback()
        } else {
          _request()
        }
      })
    }
  }
  _request()
}

sendRequestIdle(urls, timeout, 2, () => {console.log(results)})
```

## 尝试4. 进一步优化

其实到了上一步，已经满足了我们的需求。我们可以更进一步，把递归优化成迭代的形式。

这一步的工作是为了方便我们更进一步，可以更方便的去管理异步队列，抽象为一个个池子单独运行。

```js
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

// 初始化请求池
const limitPool = new LimitPool(2)

// 请求就完事了，根本不慌
for(let i of urls) {
  console.log(i)
  limitPool.call(timeout, i).then(() => console.log(results))
}
/**
 * 输出结果：
 * Array(1) [100]
 * Array(2) [100, 300]
 * Array(3) [100, 300, 500]
 * Array(4) [100, 300, 500, 200]
 */
```

此条参考的是 [limit-promise](https://github.com/leejialing/limit-promise/blob/master/lib/LimitPromise.js)

后续按照下载量排名讲解几个社区内的并发控制库

[async-pool](https://www.npmjs.com/package/tiny-async-pool)、[p-limit](https://www.npmjs.com/package/p-limit)

未完待续...
