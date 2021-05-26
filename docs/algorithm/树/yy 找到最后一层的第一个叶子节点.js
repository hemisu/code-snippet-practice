const tree = {
  val: 1,
  left: {
    val: 2,
    left: {
      val: 4,
    },
    right: {
      val: 5,
      // right: {
      //   val: 8
      // }
    }
  },
  right: {
    val: 3,
    left: {
      val: 6,
    },
    right: {
      val: 7,
    }
  },
}

const findTheLastFirst = (root) => {
  let maxDepth = -1
  let res = null
  const dfs = (root, d = 0) => {
    if(!root) return null
    if(d > maxDepth) {
      maxDepth = d
      res = root.val
    }
    dfs(root.left, d + 1)
    dfs(root.right, d + 1)
  }
  dfs(root)
  return res
}

const res = findTheLastFirst(tree)
console.log(res)