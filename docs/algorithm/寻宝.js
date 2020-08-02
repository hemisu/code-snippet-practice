/**
 * @param {string[]} maze
 * @return {number}
 */
var minimalSteps = function(maze) {
  const n = maze.length
  const m = maze[0].length
  // 方向辅助函数
  const dir = [[1, 0], [-1, 0], [0, 1], [0, -1]]
  /**
   * 判断 (x, y) 在迷宫内
   */
  const inBound = (x, y) => x >= 0 && x < n && y >= 0 && y < m
  /**
   * bfs遍历
   * 返回结果为 从 (x, y) 出发到各个点的距离
   */
  const bfs = (x, y) => {
      const ret = Array.from({ length: n }, () => Array.from({ length: m }, () => -1))
      // 设置起点
      ret[x][y] = 0
      const queue = []
      queue.push([x, y])
      while(queue.length) {
          const [curX, curY] = queue.shift()
          // 遍历四个方向
          dir.forEach(([dx, dy]) => {
              const nextX = curX + dx
              const nextY = curY + dy
              if(inBound(nextX, nextY) // 在迷宫内
                  && maze[nextX][nextY] !== '#' // 不为障碍物
                  && ret[nextX][nextY] === -1) { // 没有被访问
                  ret[nextX][nextY] = ret[curX][curY] + 1
                  queue.push([nextX, nextY])
              }
          })
      }
      return ret
  }

  const buttons = [] // 机关 M
  const stones = [] // 石头 O
  let S, T

  // 收集数据
  for(let i = 0; i < n; i++) {
      for(let j = 0; j < m; j++) {
          const tmp = maze[i][j]
          if(tmp === 'M') buttons.push([i, j])
          if(tmp === 'O') stones.push([i, j])
          if(tmp === 'S') S = [i, j]
          if(tmp === 'T') T = [i, j]
      }
  }

  const nb = buttons.length
  const sb = stones.length

  // 从起点出发到其他点的距离
  const startDist = bfs(S[0], S[1])
  // 处理边界条件 没有机关
  if(nb === 0) return startDist[T[0]][T[1]]
  // 从某个机关 到 其他机关+起点+终点的最短距离
  const dist = Array.from({ length: nb }, () => Array.from({ length: nb + 2 }, () => -1))

  // 中间结果 start 最终为了得到 从某个机关到其他机关+起点+终点的最短距离
  // dd[i] 存储的是第i个机关出发到其他节点的距离
  // const dd = []
  // for(let i = 0; i < nb; i++) {
  //     const [x, y] = buttons[i]
  //     dd[i] = bfs(x, y)
  //     // 从某个点到终点不需要拿石头
  //     dist[i][nb + 1] = dd[i][T[0]][T[1]]
  // }
  const dd = new Array(nb)
  for(let i = 0; i < nb; i++) {
      let d = bfs(buttons[i][0], buttons[i][1])
      dd[i] = d
      dist[i][nb + 1] = d[T[0]][T[1]]
  }

  for(let i = 0; i < nb; i++) {
      let tmp = -1
      // 找出从 起点 -> 石头 -> 机关 最近的距离
      for(let k = 0; k < sb; k++) {
          const [mX, mY] = stones[k]
          if(dd[i][mX][mY] !== -1 && startDist[mX][mY] !== -1) {
              if(tmp === -1 || tmp > dd[i][mX][mY] + startDist[mX][mY]) {
                  tmp = dd[i][mX][mY] + startDist[mX][mY]
              }
          }
      }
      // 起点到机关的最短距离
      dist[i][nb] = tmp

      // 机关到机关之间的最短距离
      for(let j = i + 1; j < nb; j++) {
          let mn = -1
          for(let k = 0; k < sb; k++) {
              const [mX, mY] = stones[k]
              if(dd[i][mX][mY] !== -1 && dd[j][mX][mY] !== -1) {
                  if(mn === -1 || mn > dd[i][mX][mY] + dd[j][mX][mY]) {
                      mn = dd[i][mX][mY] + dd[j][mX][mY]
                  }
              }
          }
          dist[i][j] = mn
          dist[j][i] = mn
      }
  }
  // 中间结果结束，得到我们需要的dist

  // 无法达成的情形
  for(let i = 0; i < nb; i++) {
      // 从起点无法达到机关 or 从机关无法到达终点
      if(dist[i][nb] === -1 || dist[i][nb + 1] === -1) {
          return -1
      }
  }

  // DP 状态压缩
  // 定义 f(mask,i) 表示当前在第 i 个 M 处，触发状态为 mask 的最小步数, mask表示当前已触发的集合
  const dp = Array.from({ length: 1 << nb }, () => Array.from({ length: nb }, () => -1))
  // base case, 从起点到第i个机关，dp[0001]表示有4个机关的情况下，触发第一个机关的最小步数
  for(let i = 0; i < nb; i++) {
      dp[1 << i][i] = dist[i][nb]
  }
  // 状态转移 直接从小遍历
  for(let mask = 1; mask < (1 << nb); mask++) {
      for(let i = 0; i < nb; i++) {
          if((mask & (1 << i)) !== 0) { // 检验当前dp合法
              for(let j = 0; j < nb; j++) {
                  if((mask & (1 << j)) === 0) { // j 不在 mask里
                      const next = mask | (1 << j)
                      if (dp[next][j] == -1 || dp[next][j] > dp[mask][i] + dist[i][j]) {
                          dp[next][j] = dp[mask][i] + dist[i][j];
                      }
                  }
              }
          }
      }
  }

  let ret = -1
  const finalMask = (1 << nb) - 1
  // 得出各个走法到终点的最短距离
  for(let i = 0; i < nb; i++) {
      if(ret === -1 || ret > dp[finalMask][i] + dist[i][nb + 1]) {
          ret = dp[finalMask][i] + dist[i][nb + 1]
      }
  }
  return ret

};

minimalSteps(["S#O", "M..", "M.T"])
