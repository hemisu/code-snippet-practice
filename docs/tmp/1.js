const inputs = [
  [1, 2, 5],
  [1, 3, 6],
  [2, 4, 8],
  [3, 4, 6]
]
const findMinTime = () => {
  const n = 4 // 节点数
  const m = 4 // 边数
  const st = 1 // 起点  
  const end = 4 // 终点
  const time = '7.9/8'

  let minCostTime = Number.MAX_VALUE // 最短时间
  const visited = new Set() // 受访节点

  const dfs = (s, sum) => {
    if(s === end) {
      // 访问到达终点
      minCostTime = Math.min(sum, minCostTime)
      return
    }

    inputs
      .filter(([u, v]) => (u === s || v === s)) // 无向图,都可以作为起点
      .forEach(([u, v, cost]) => {
        // u => v
        if(!visited.has(v)) {
          visited.add(v) // 访问这个节点
          dfs(v, sum + cost)
          visited.delete(v) // 回溯
        }
        
        // v => u
        if(!visited.has(u)) {
          visited.add(u) // 访问这个节点
          dfs(u, sum + cost)
          visited.delete(u) // 回溯
        }
      })
  }
  
  dfs(st, 0)

  /**
   * 处理输出的时间
   * @param {String} str 
   * @param {Number} minCostTime 
   */
  const handleTime = (str, minCostTime) => {
    const [_, month, day, hour] = str.match(/(\d)+\.(\d)+\/(\d)+/)
    const nextHour = (+hour + minCostTime) % 24
    const nextDay = (+day + (+hour + minCostTime) / 24 | 0) % 24
    const nextMonth = +month + (+day + (+hour + minCostTime) / 24 | 0) / 31 | 0
    return `${nextMonth}.${nextDay}/${nextHour}`
  }
  
  return handleTime(time, minCostTime)
}

findMinTime()