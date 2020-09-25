const results = [];
const timeout = i =>
  new Promise(resolve =>
    setTimeout(() => {
      results.push(i);
      resolve();
    }, i)
  )

const urls = [100, 500, 300, 200]

async function asyncPool(poolLimit, array, iteratorFn) {
  const ret = []
  const exectuing = []

  for(const item of array) {
    const p = Promise.resolve().then(() => iteratorFn(item, array))
    ret.push(p)
    const e = p.then(() => exectuing.splice(exectuing.indexOf(e), 1))
    exectuing.push(e)
    if(exectuing.length >= poolLimit) {
      await Promise.race(exectuing)
    }
  }
  return Promise.all(ret)
}

// 运用for...of + Promise.race


(async function main() {
  await asyncPool(2, urls, timeout)
  console.log(results)
})()