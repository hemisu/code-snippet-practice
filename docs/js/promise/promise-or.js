function or(...promises) {
  let i = 0
  return (function next(values) {
    if(!values && i < promises.length) {
      return Promise.resolve(promises[i++]).then(next)
    }
    return Promise.resolve(values)
  })(false)
}
// or(Promise.resolve(false), Promise.resolve('hi'))
//   .then(function (actual) {
//     var expected = 'hi';
//     console.log(actual, expected)
//   });

// or(Promise.resolve('hi'), Promise.resolve(false))
//   .then(function (actual) {
//     var expected = 'hi';
//     console.log(actual, expected)
//   });

function and(...promises) {
  let i = 0
  return (function next(values) {
    if(values && i < promises.length) {
      return Promise.resolve(promises[i++]).then(next)
    }
    return Promise.resolve(values)
  })(true)
}
and(Promise.resolve(false), Promise.resolve('hi'))
  .then(function (actual) {
    var expected = false;
    console.log(actual, expected)
  });

and(Promise.resolve('hi'), Promise.resolve('last true'))
  .then(function (actual) {
    var expected = 'hi';
    console.log(actual, expected)
  });