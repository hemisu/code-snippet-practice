// 手写async，await的最简实现
const getData = () => new Promise(resolve => setTimeout(() => resolve("data"), 1000))

// async function test() {
//   const data = await getData()
//   console.log('data: ', data);
//   const data2 = await getData()
//   console.log('data2: ', data2);
//   return 'success'
// }

// 这样的一个函数 应该再1秒后打印data 再过一秒打印data2 最后打印success
// test().then(res => console.log(res))

var test = asyncToGenerator(testG)

test().then(res => console.log(res))

// 现在要构建一个 asyncToGenerator ，接受一个 generator 函数，返回 promise

function* testG() {
  // await被编译成了yield
  const data = yield getData()
  console.log('data: ', data);
  const data2 = yield getData()
  console.log('data2: ', data2);
  return 'success'
}

function asyncToGenerator(generatorFunc) {
  return function() {
    const gen = generatorFunc.apply(this, arguments)
    return new Promise((resolve, reject) => {
      function step(key, arg) {
        let generatorResult
        try {
          generatorResult = gen[key](arg)
        } catch (e) {
          return reject(error)
        }

        const { value, done } = generatorResult
        if (done) {
          return resolve(value)
        } else {
          return Promise.resolve(value).then(val => step('next', val), err => step('throw', err))
        }
      }
      // 需要执行一次 启动generator的内部代码 
      step('next')
    })
  }
}