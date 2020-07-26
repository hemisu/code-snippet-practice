// 戳气球
var maxCoins = function(nums) {
  let maxNum = Number.MIN_SAFE_INTEGER
  const newNums = [1, ...nums, 1]
  const n = nums.length
  const memo = new Array(n + 2).fill().map(() => new Array(n + 2).fill(null))

  const backtrackWithMemo = (l, r) => {
      if(memo[l][r] !== null) return memo[l][r]
      let max = 0

      for(let k = l + 1; k < r; k++) {
          max = Math.max(
              max,
              backtrackWithMemo(l, k) +
              newNums[l] * newNums[k] * newNums[r] +
              backtrackWithMemo(k, r)
          )
      }
      return (memo[l][r] = max)
  }
  
  return backtrackWithMemo(0, n + 1)
};
const result = maxCoins([3,1,5,8])
console.log(result)
