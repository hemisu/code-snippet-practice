const target = {
  id: 'foo'
}
const handle = {
  get: function(target, key, receiver) {
    console.log('%c 🥕 target, key, receiver: ', 'font-size:20px;background-color: #2EAFB0;color:#fff;', target, key, receiver);
    return Reflect.get(...arguments)
  }
}
const proxy = new Proxy(target, handle)
console.log(target.id)
console.log(proxy.id)