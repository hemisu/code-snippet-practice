const n = 4
const geneBoard = (pre) => {
  const res = []
  for(let i = 0; i < n; i++) {
    let str = ''
    for(let j = 0; j < n; j++) {
      str += pre[i] === j ? 'Q' : '.'
    }
    res.push(str)
  }
  return res
}

const res = geneBoard([ 1, 3, 0, 2 ])
console.log(res)