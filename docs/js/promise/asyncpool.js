let assert, assertType;
const shouldAssert = process.env.NODE_ENV === "development";

if (shouldAssert) {
  ({ assert, assertType } = require("yaassertion"));
}

exports.asyncPoolES6 = function asyncPool(poolLimit, array, iteratorFn) {
  if (shouldAssert) {
    try {
      assertType(poolLimit, "poolLimit", ["number"]);
      assertType(array, "array", ["array"]);
      assertType(iteratorFn, "iteratorFn", ["function"]);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  let i = 0;
  const ret = [];
  const executing = [];
  const enqueue = function() {
    if (i === array.length) {
      return Promise.resolve();
    }
    const item = array[i++];
    const p = Promise.resolve().then(() => iteratorFn(item, array));
    ret.push(p);
    const e = p.then(() => executing.splice(executing.indexOf(e), 1));
    executing.push(e);
    let r = Promise.resolve();
    if (executing.length >= poolLimit) {
      r = Promise.race(executing);
    }
    return r.then(() => enqueue());
  };
  return enqueue().then(() => Promise.all(ret));
}

 
exports.asyncPoolES7 = async function asyncPool(poolLimit, array, iteratorFn) {
  if (shouldAssert) {
    assertType(poolLimit, "poolLimit", ["number"]);
    assertType(array, "array", ["array"]);
    assertType(iteratorFn, "iteratorFn", ["function"]);
  }
  const ret = [];
  const executing = [];
  for (const item of array) {
    const p = Promise.resolve().then(() => iteratorFn(item, array));
    ret.push(p);
    const e = p.then(() => executing.splice(executing.indexOf(e), 1));
    executing.push(e);
    if (executing.length >= poolLimit) {
      await Promise.race(executing);
    }
  }
  return Promise.all(ret);
}

exports.asyncPoolSelf = function asyncPool(poolLimit, array, iter) {
  let i = 0
  const ret = []
  const executing = []
  const queue = () => {
    if (i === array.length) {
      return Promise.resolve()
    }
    const item = array[i++]
    const p = Promise.resolve().then(() => iter(item, array))
    ret.push(p)
    const e = p.then(() => executing.splice(executing.indexOf(e), 1))
    executing.push(e)
    let r = Promise.resolve()
    if(executing.length >= poolLimit) {
      r = Promise.race(executing)
    }
    return r.then(() => queue())
  }
  return queue().then(() => Promise.all(ret))
}