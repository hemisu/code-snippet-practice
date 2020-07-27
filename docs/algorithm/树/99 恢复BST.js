/**
 * @param {TreeNode} root
 * @return {void} Do not return anything, modify root in-place instead.
 */
var recoverTree = function (root) {
  let p, prev;
  const traverse = (root) => {
    if (!root) return
    traverse(root.left)
    // 这里干活
    if (root.val < prev.val) {
      
      root.val = prev.val
    }

    prev = root
    traverse(root.right)
  }

};