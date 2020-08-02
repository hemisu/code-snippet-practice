// 第一种 常规思路
var flatten = function(root) {
  const helper = (root) => {
    if (!root) {
      return
    }
    res.push(root)
    helper(root.left)
    helper(root.right)
  }
  let res = []
  helper(root)
  for(let i = 0 ; i < res.length - 1; i++) {
    res[i].left = null
    res[i].right = res[i + 1]
  }
};

// 第二种
/* 
    1 6
   / \
  2 5 5 2
 / \   \
3 4 4 3 6 1

 */

var flatten = function(root) {
  let pre = null
  const helper = (root) => {
    if(!root) return
    helper(root.right)
    helper(root.left)
    root.left = null
    root.right = pre
    pre = root
  }
  helper(root)
}