const list = [1, 2, 3]
const square = num => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(num * num)
    }, 1000)
  })
}

function test() {
  // list.forEach(async x=> {
  //   const res = await square(x)
  //   console.log(res)
  // })
  list.reduce((p, c) => p.then(() => square(c)).then(console.log), Promise.resolve())
}
test()