var smallestRange = function(nums) {
  const k = nums.length
  const flatNums = nums.reduce(
    (pre, cur, i) => [...pre, ...cur.map(num => ({ num, row: i }))], [])
  .sort(({ num: a }, { num: b }) => (a - b))
  console.log(flatNums)

  let count = 0
  let left = 0
  let minLen = Infinity
  let minStart = 0
  const map = Array.from({ length: k }).fill(0)

  // 滑动窗口 先扩张
  for(let right = 0; right < flatNums.length; right++) {
    // 找到了一个
    if(map[flatNums[right].row] === 0) count++
    map[flatNums[right].row]++
    // 收缩
    while(count === k && left <= right) {
      if(flatNums[right].num - flatNums[left].num < minLen) {
        minLen = flatNums[right].num - flatNums[left].num
        minStart = flatNums[left].num
      }
      // 收缩
      map[flatNums[left].row]--
      if(map[flatNums[left].row] === 0) count--
      left++
    }
  }
  return [minStart, minStart + minLen]
  

};

const result = smallestRange(
  [[4,10,15,24,26], [0,9,12,20], [5,18,22,30]]
)

console.log(result)