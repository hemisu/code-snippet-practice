Function.prototype.apply2 = function (context, args) {
  var context = Object(context) || global;
  context.fn = this
  let result 
  if(args) {
    result = context.fn(...args)
  } else {
    result = context.fn()
  }
  delete context.fn
  return result
}

// 测试一下
var value = 2;

var obj = {
  value: 1
}

function bar(name, age) {
  console.log(this.value);
  return {
    value: this.value,
    name: name,
    age: age
  }
}

bar.apply2(null); // 2

console.log(bar.apply2(obj, ['kevin', 18]));