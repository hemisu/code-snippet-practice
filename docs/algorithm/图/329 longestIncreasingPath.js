// memo dfs
var longestIncreasingPath = function (matrix) {
  const n = matrix.length
  const m = matrix[0].length
  const dir = [[1, 0], [-1, 0], [0, 1], [0, -1]]
  const memo = Array.from({ length: n }, () => Array.from({ length: m }).fill(0))

  let ans = Number.MIN_SAFE_INTEGER
  // dfs
  const dfs = (i, j) => {
    if (memo[i][j] !== 0) return memo[i][j]

    memo[i][j]++
    dir.forEach(([ni, nj]) => {
      const newRow = ni + i
      const newCol = nj + j
      if (newRow >= 0 && newRow < n && newCol >= 0 && newCol < m && matrix[i][j] < matrix[newRow][newCol]) {
        memo[i][j] = Math.max(
          memo[i][j],
          dfs(newRow, newCol) + 1
        )
      }
    })
    return memo[i][j]
  }
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      ans = Math.max(dfs(i, j), ans)
    }
  }
  return ans
};

// const res = longestIncreasingPath(
//   [
//     [9,9,4],
//     [6,6,8],
//     [2,1,1]
//   ]
// )
const res = longestIncreasingPath(
  [[0], [1], [5], [5]]
)
console.log(res)