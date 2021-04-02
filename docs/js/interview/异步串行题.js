// const e = require("express");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const log = _ => console.log(_)
const flat = (arr, depth = 1) => 
  arr.reduce((a, v) => a.concat(depth > 1 && Array.isArray(v) ? flat(v, depth - 1) : v), [])


const subFlow = createFlow([() => delay(1000).then(() => log("c"))]);

createFlow([
  () => log("a"),
  () => log("b"),
  subFlow,
  [() => delay(1000).then(() => log("d")), () => log("e")],
]).run(() => {
  console.log("done");
});

// 需要按照 a,b,延迟1秒,c,延迟1秒,d,e, done 的顺序打印
function createFlow(effects = []) {
  return {
    run: (cb) => effects.reduce((promise, next) => {
      if(Array.isArray(next)) return promise.then(createFlow(next).run)
      else if(typeof next.run === 'function') return promise.then(next.run)
      else return promise.then(next)
    }, Promise.resolve()).then(cb)
  }
}

// function flat (arr, depth = 1) {
//   return arr.reduce((a, v) => a.concat(depth > 1 
//     && Array.isArray(v) ? flat(v, depth - 1) : v), [])
// } 


function createFlow (effects = []) {
  const middleware = flat(effects.map(item => item.middleware ? item.middleware : item), Infinity)
  
  function dispatch(i) {
    let fn = middleware[i]
    if(i === effects.length) fn = null
    if(!fn) return Promise.resolve();
    
    try {
      return Promise.resolve(fn()).then(dispatch(i + 1))
    } catch (err) {
      return Promise.reject(err)
    }
  }
  return {
    run: async (cb) => {
      return dispatch(0).then(cb)
    },
    middleware,
  }
}

function compose (middleware) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }

  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */

  return function (context, next) {
    // last called middleware #
    let index = -1
    return dispatch(0)
    function dispatch (i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i]
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve()
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}

function createFlow(handlers) {
  return {
    effects: handlers.map(item => item.effects ? item.effects : item).flat(),
    results: [],
    async *[Symbol.asyncIterator]() {
      for(let func of this.effects) {
        const res = await func()
        yield res
      }
    },
    async run(callback) {
      this.effects.forEach(_ => console.log(_.toString()))
      for await(let res of this) {
        this.results.push(res)
      }
      callback(this.results)
    }
  }
}

/* function createFlow(effects) {
  return {
    run: (cb) => effects.reduce((promise, flow) => {
      if(Array.isArray(flow)) return promise.then(createFlow(flow).run) // 对付 [() => log(1), () => log(2)]
      else if (typeof flow.run === 'function') return promise.then(flow.run) // 对付 createFlow
      else return promise.then(flow) // 对付() => log("a")
    }, Promise.resolve()).then(cb)
  }
} */

/* function createFlow(effects) {
  return {
    run: (cb) => 
      effects.reduce((pre, cur) => {
        if(Array.isArray(cur)) {
          return pre.then(createFlow(cur).run)
        } else if (typeof cur.run === 'function') {
          return pre.then(cur.run)
        } else {
          return pre.then(cur)
        }
      }, Promise.resolve())
      .then(() => cb && typeof cb === 'function' && cb())
  }
} */

/* function createFlow(effects = []) {
  let sources = effects.slice().flat();
  function run(callback) {
    while (sources.length) {
      const task = sources.shift();
      // 把callback放到下一个flow的callback时机里执行
      const next = () => createFlow(sources).run(callback)
      if (typeof task === "function") {
        const res = task();
        if (res && res.then) {
          res.then(next);
          return;
        }
      } else if (task && task.isFlow) {
        task.run(next);
        return;
      }
    }
    (callback && callback())
  }
  return {
    run,
    isFlow: true,
  };
} */

// function createFlow(...flows) {
//   const tasks = flows.slice().flat()
//   const run = cb => {
//     while (tasks.length) {
//       const task = tasks.shift()
//       const next = () => createFlow(tasks).run(cb)
//       if (typeof task === 'function') {
//         const res = task()
//         if (res && res.then) {
//           res.then(next)
//           return
//         } else if (task && task.isFlow) {
//           task.run(next)
//           return;
//         }
//       }
//     }
//     cb && cb()
//   }

//   return {
//     run,
//     isFlow: true
//   }
// }