/**
 * 编写一个函数计算过个数组的交集
 */
function multiArrMerge(...arrs) {
  arrs = arrs.map(item => [...new Set(item)]) // 去重
  let result = arrs[0]
  for(let arr of arrs) {
    result = result.filter(item => arr.includes(item))
  }
  return result
}

const result = multiArrMerge(
  [1, 2, 3, 5, 1, 1, 3, 2, 5],
  [1, 3, 5, 1, 3, 5],
  [1, 3, 1, 1, 3]
)

console.log('%cresult: ', 'color: MidnightBlue; background: Aquamarine;', result);