// 一种continuation monad的推导
/**
 * 定义 monad 一个容器
 * 实现了以上两个函数
 * unit :: a -> monad a
 * bind :: monad a -> (a -> monad b) -> monad b
 */

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

// 按照getFoo->getBar->getBaz->getSna的顺序调用
function call(param, next) {
  // 写回调的同时将控制权交出去了
  getFoo(param, (foo) => {
    getBar(foo, (bar) => {
      getBaz(bar, (sna) => {
        getSna(sna, next)
      })
    })
  })
}

// console.log("call：")
// call("o", param => { console.log("end: " + param)})

// 使用unit和bind结合Array.prototype.reduce优雅解决callback hell
// 注： 原文中使用的 reduce 可以看作 compose
function call2(param, next) {
  const unit = arg => f => f(arg)
  /* bind :: monad a -> (a -> monad b) -> monad b */
  // 这里的 g = (param, next) => next()
  const bind = (f, g) => (next) => {
    f(arg => g(arg, next))
  }
  // const curry = (fn, arity = fn.length, ...args) =>
  //   arity <= args.length ? fn(...args) : curry.bind(null, fn, arity, ...args)
  // const bind = (fn, context, ...boundArgs) => (...args) => fn.apply(context, [...boundArgs, ...args]);
  [getFoo, getBar, getBaz, getSna].reduce(bind, unit(param))(next)
}
// console.log("call2：")
// call2("o", param => { console.log("end: " + param) })

/* 从 call 推导到 call2 */
// 扁平
// 将匿名函数转为引用，压扁嵌套回调，根据引用依赖倒置顺序
function call11(param, next) {
  const bazNext = baz => { // 闭包引用getSna, next
    getSna(baz, next)
  }
  const barNext = bar => { // 闭包引用getBaz, bazNext
    getBaz(bar, bazNext)
  }
  const fooNext = foo => { // 闭包引用getBar, barNext
    getBar(foo, barNext)
  }
  getFoo(param, fooNext)

  // getFoo(param, (foo) => {
  //   getBar(foo, (bar) => {
  //     getBaz(bar, (sna) => {
  //       getSna(sna, next)
  //     })
  //   })
  // })
}
/** 从 call11 推导到 call12
 * fooNext 闭包转为参数引用，抽离调用
 */
function call12(param, next) {
  const bazNext = baz => { // 闭包引用getSna, next
    getSna(baz, next)
  }
  const barNext = bar => { // 闭包引用getBaz, bazNext
    getBaz(bar, bazNext)
  }
  const fooNext = foo => { // 闭包引用getBar, barNext
    getBar(foo, barNext)
  }
  // getFoo(param, fooNext)
  const fooM = (next) => {
    getFoo(param, next)
  }

  fooM(fooNext)
}
/** 从 call12 推导到 call13
 * fooNext 代入
 */
function call13(param, next) {
  const bazNext = baz => { // 闭包引用getSna, next
    getSna(baz, next)
  }
  const barNext = bar => { // 闭包引用getBaz, bazNext
    getBaz(bar, bazNext)
  }
  const fooM = (next) => {
    getFoo(param, next)
  }
  fooM(foo => { // 闭包引用getBar, barNext
    getBar(foo, barNext)
  })
  // fooM(fooNext)
}
/** 从 call13 推导到 call14
 * barNext闭包引用转为参数引用，隔离依赖，抽离调用
 */
function call14(param, next) {
  const bazNext = baz => { // 闭包引用getSna, next
    getSna(baz, next)
  }
  const barNext = bar => { // 闭包引用getBaz, bazNext
    getBaz(bar, bazNext)
  }
  const fooM = (next) => {
    getFoo(param, next)
  }
  const barM = (next) => {
    fooM(foo => {
      getBar(foo, next)
    })
  }
  barM(barNext)
  // fooM(foo => { // 闭包引用getBar, barNext
  //   getBar(foo, barNext)
  // })
}
/** 从 call14 推导到 call15
 * barNext引入
 */
function call15(param, next) {
  const bazNext = baz => { // 闭包引用getSna, next
    getSna(baz, next)
  }
  const fooM = (next) => {
    getFoo(param, next)
  }
  const barM = (next) => {
    fooM(foo => {
      getBar(foo, next)
    })
  }
  barM(bar => {
    getBaz(bar, bazNext)
  })
  // fooM(foo => { // 闭包引用getBar, barNext
  //   getBar(foo, barNext)
  // })
}
/** 从 call15 推导到 call16
 * bazNext闭包引用转为参数引用，隔离依赖，抽离调用
 */
function call16(param, next) {
  const bazNext = baz => { // 闭包引用getSna, next
    getSna(baz, next)
  }
  const fooM = (next) => {
    getFoo(param, next)
  }
  const barM = (next) => {
    fooM(foo => {
      getBar(foo, next)
    })
  }
  const bazM = (next) => {
    barM(bar => {
      getBaz(bar, next)
    })
  }
  bazM(bazNext)
}
// console.log("\ncall 16");
// call16("o",function(param){console.log("end: "+param)});

/** 从 call16 推导到 call17
 * bazNext代入
 */
function call17(param, next) {
  const fooM = (next) => {
    getFoo(param, next)
  }
  const barM = (next) => {
    fooM(foo => {
      getBar(foo, next)
    })
  }
  const bazM = (next) => {
    barM(bar => {
      getBaz(bar, next)
    })
  }
  bazM(baz => { // 闭包引用getSna, next
    getSna(baz, next)
  })
}

// console.log("\ncall 17");
// call17("o",function(param){console.log("end: "+param)});

/** 从 call17 推导到 call18
 * bazNext闭包引用转化为参数引用，隔离依赖，抽离调用
 */
function call18(param, next) {
  const fooM = (next) => {
    getFoo(param, next)
  }
  const barM = (next) => {
    fooM(foo => {
      getBar(foo, next)
    })
  }
  const bazM = (next) => {
    barM(bar => {
      getBaz(bar, next)
    })
  }
  const snaM = (next) => {
    bazM(baz => { // 闭包引用getSna, next
      getSna(baz, next)
    })
  }
  snaM(next)
}

// 根据barM，bazM，snaM用新增容器函数initM规整化fooM
function call19(param, next) {
  // const fooM = (next) => {
  //   getFoo(param, next)
  // }
  const initM = f => f(param) // unit :: a -> monad a
  const fooM = (next) => {
    initM(a => {
      getFoo(a, next)
    })
  }
  const barM = (next) => {
    fooM(foo => {
      getBar(foo, next)
    })
  }
  const bazM = (next) => {
    barM(bar => {
      getBaz(bar, next)
    })
  }
  const snaM = (next) => {
    bazM(baz => { // 闭包引用getSna, next
      getSna(baz, next)
    })
  }
  snaM(next)
}

// 构造函数unit生成initM，initM闭包引用转为参数引用，隔离依赖，抽离调用
function call19(param, next) {
  // const fooM = (next) => {
  //   getFoo(param, next)
  // }
  const unit = arg => f => f(arg)
  // const initM = f => f(param) // unit :: a -> monad a
  const initM = unit(param)
  // bind :: monad a -> (a -> monad b) -> monad b
  const fooM = (next) => {
    initM(a => {
      getFoo(a, next)
    })
  }
  const barM = (next) => {
    fooM(foo => {
      getBar(foo, next)
    })
  }
  const bazM = (next) => {
    barM(bar => {
      getBaz(bar, next)
    })
  }
  const snaM = (next) => {
    bazM(baz => { // 闭包引用getSna, next
      getSna(baz, next)
    })
  }
  snaM(next)
}

const bind = (f, g) => (next) => {
  f(arg => g(arg, next))
}