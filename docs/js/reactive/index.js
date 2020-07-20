const arrayProto = Array.prototype

function def(obj, key) {
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    value: function(...args) {
      console.log(key)
      console.log(args)

      // 获取原生方法
      const original = arrayProto[key]
      const result = original.apply(this, args)

      console.log('数据被改变了，更新一下视图吧')
      return result
    }
  })
}
let obj = {
  push() {}
}

def(obj, 'push')

let arr = [0]

arr.__proto__ = obj

arr.push([1,2], 7, 'hello!')
console.log(arr)


class Watcher {
  addDep() {}
  update() {}
}

function defineReactive(obj, key, val) {
  let Dep
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: () => {
      console.log('[getter] 收集依赖')
      Dep.depend()
      return val
    },
    set: newVal => {
      if(val === newVal) return;
      val = newVal
      Dep.notify()
      console.log('[setter] 通知依赖更新')
    }
  })
}

let data = {
  text: 'hello world'
}

defineReactive(data, 'text', data.text)

console.log(data.text)
data.text = 'hello vue'
