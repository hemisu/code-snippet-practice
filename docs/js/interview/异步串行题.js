const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const log = _ => console.log(_)

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
    async run(callback) {
      const flatEffects = effects.flat(Infinity)
      for(let )
    }
  }
}
// function createFlow(handlers) {
//   return {
//     effects: handlers.map(item => item.effects ? item.effects : item).flat(),
//     results: [],
//     async *[Symbol.asyncIterator]() {
//       for(let func of this.effects) {
//         const res = await func()
//         yield res
//       }
//     },
//     async run(callback) {
//       this.effects.forEach(_ => console.log(_.toString()))
//       for await(let res of this) {
//         this.results.push(res)
//       }
//       callback(this.results)
//     }
//   }
// }

// function createFlow(effects) {
//   return {
//     run: (cb) => effects.reduce((promise, flow) => {
//       if(Array.isArray(flow)) return promise.then(createFlow(flow).run) // 对付 [() => log(1), () => log(2)]
//       else if (typeof flow.run === 'function') return promise.then(flow.run) // 对付 createFlow
//       else return promise.then(flow) // 对付() => log("a")
//     }, Promise.resolve()).then(cb)
//   }
// }

// function createFlow(effects) {
//   return {
//     run: (cb) => 
//       effects.reduce((pre, cur) => {
//         if(Array.isArray(cur)) {
//           return pre.then(createFlow(cur).run)
//         } else if (typeof cur.run === 'function') {
//           return pre.then(cur.run)
//         } else {
//           return pre.then(cur)
//         }
//       }, Promise.resolve())
//       .then(() => cb && typeof cb === 'function' && cb())
//   }
// }

// function createFlow(effects = []) {
//   let sources = effects.slice().flat();
//   function run(callback) {
//     while (sources.length) {
//       const task = sources.shift();
//       // 把callback放到下一个flow的callback时机里执行
//       const next = () => createFlow(sources).run(callback)
//       if (typeof task === "function") {
//         const res = task();
//         if (res && res.then) {
//           res.then(next);
//           return;
//         }
//       } else if (task && task.isFlow) {
//         task.run(next);
//         return;
//       }
//     }
//     (callback && callback())
//   }
//   return {
//     run,
//     isFlow: true,
//   };
// }

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