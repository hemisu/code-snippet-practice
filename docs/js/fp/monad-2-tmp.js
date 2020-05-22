function getFoo(param, next) {
  setTimeout(() => {
    console.log("get Foo: " + param)
    next("foo<-" + param)
  }, 100);
}

function getBar(param, next) {
  setTimeout(() => {
    console.log("get Bar: " + param)
    next("bar<-" + param)
  }, 100);
}

function getBaz(param, next) {
  setTimeout(() => {
    console.log("get Baz: " + param)
    next("baz<-" + param)
  }, 100);
}

function getSna(param, next) {
  setTimeout(() => {
    console.log("get Sna: " + param)
    next("sna<-" + param)
  }, 100);
}

function call(param, next) {
  // const unit = arg => f => f(arg)
  // 抽离通用函数 bind，闭包引用变为参数引用
  // const bind = (f, m) => next => {
  //   f(arg => m(arg, next))
  // }
  // 改造bind变为unit的方法
  function unit(arg) {
    var ret = f => {
      f(arg)
    }
    function bind(m) {
      var f = this,
          ret = (next) => {
            f(arg => {
              m(arg, next)
            })
          }
      ret.bind = bind
      return ret
    }
    ret.bind = bind
    return ret
  }
  unit(param)
    .bind(getFoo)
    .bind(getBar)
    .bind(getBaz)
    .bind(getSna)(next)
  // [getFoo, getBar, getBaz, getSna].reduce(bind, unit(param))(next)
}
console.log('call')
call('o', (param) => { console.log('end: ', param)})
// 至此原有的依赖按 getFoo->getBar->getBaz->getSna 的顺序调用，参数通过回调函数传入
// 现在依赖的顺序调反过来了
// reference: <http://hai.li/2015/06/29/js-continuation-monad-derivation.html>

/* 
  So what in all this is the monad itself? A combination of these three things defines "the monad":
  The bind function
  The unit function
  The 'function (onComplete, onFail) {...}' signature. 
  This is the 'type constructor' for the monad. 
  The objects that we've named ending with 'M' (fooM, barM, etc) are all of this type.
*/