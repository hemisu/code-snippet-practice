纯回调函数会存在控制反转的问题，回调中的代码无法预期自己被执行时的环境：
- 回调被执行多次
- 回调一次都没有被执行
- 回调不是异步执行而是被同步执行
- 回调被过早或者过晚执行
- 回调报错被第三方吞

promise充当了一个中间层，把回调造成的控制反转再反转回去

控制流分为了两个部分：触发异步前的逻辑通过 new 传入 Promise，而异步操作完成后的逻辑则传入 Promise 的 then 接口中

这种模式其实和观察者模式是接近的。下面的代码将 resolve / then 换成了 publish / subscribe，将通过 new Promise 生成的 Promise 换成了通过 observe 生成的 observable 实例。可以发现，这种调用同样做到了回调嵌套的解耦。这就是 Promise 魔法的关键之一。

```js
// observe 相当于 new Promise
// publish 相当于 resolve
let observable = observe(publish => {
  ajax.get('xxx', data => {
    // ...
    publish(data)
  })
})

// subscribe 相当于 then
observable.subscribe(data => {
  console.log(data)
  // ...
})
```

reference: <https://ewind.us/2017/promise-implementing/>