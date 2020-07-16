

var isBipartite = function (graph) {
  // 1 绿色 -1 红色 undefined 未访问
  const visited = new Array(graph.length)

  for (let i = 0; i < graph.length; i++) {
    if (visited[i]) continue
    const queue = [i]
    visited[i] = 1 // 染色为绿色

    while (queue.length) {
      const cur = queue.shift()
      const curColor = visited[cur]
      const neighborColor = -curColor // 设置反色，比如绿色的周边都设置为红色
      // 访问相邻节点
      for (let j = 0; j < graph[cur].length; j++) {
        const neiborNode = graph[cur][j]
        if (visited[neiborNode] === undefined) {
          // 染色
          visited[neiborNode] = neighborColor
          queue.push(neiborNode)
        } else if (visited[neiborNode] !== neighborColor) {
          return false
        }
      }
    }
  }
  return true
};

const data = [[1, 3], [0, 2], [1, 3], [0, 2]]
isBipartite(data)