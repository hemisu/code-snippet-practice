const e = require("express");

const getData = () => new Promise(resolve => setTimeout(() => resolve("data"), 1000))
  
var test = asyncToGenerator(
    function* testG() {
      // await被编译成了yield
      const data = yield getData()
      console.log('data: ', data);
      const data2 = yield getData()
      console.log('data2: ', data2);
      return 'success'
    }
)

test().then(res => console.log(res))

function asyncToGenerator(func) {
  // 返回的是一个新的函数
  return function() {
    // 调用generator函数 生成迭代器
    // 对应 var gen = testG()
    const gen = func.apply(this, arguments)

    // 需要返回一个Promise 因为外部调用使用Promise.then 或者await
    return new Promise((resolve, reject) => {
      /**
       * 内部定义一个step函数用来调用yield返回的结果
       * @param key {'next'|'throw'} 有两种取值，对应generator的两种
       * @param arg 把promise resolve出来的值交给下一个yiled
       */
      function step(key, arg) {
        let generatorRes

        try {
          generatorRes = gen[key](arg)
        } catch (err) {
          return reject(err)
        }

        const { value, done } = generatorRes
        if(done) {
          return resolve(value)
        } else {
          // 最后结束外，每次调用 gen.next() 返回的都是{ value: Promise, done: false } 结构
          // 需要使用 Promise#resolve 这个静态方法来处理 value
          // 传入的promise被resolve时，才会执行后面的then
          return Promise.resolve(value)
            // promise决议完成，会执行后面的next
            // 只要done不是true就会递归往下解开promise
            // gen.next().value.then(value => {
            //   gen.next().value.then(value => {
            //     gen.next() 到这里会reolve被return的Promise，然后执行最外层的.then打印console.log
            //   })
            // })
            .then(val => step('next', val), err => step('throw', err))
        }
      }
      step('next')
    })

  }

}