/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 * 中序遍历 inorder = [9,3,15,20,7]
 * 后序遍历 postorder = [9,15,7,20,3]
 */
/**
 * @param {number[]} inorder
 * @param {number[]} postorder
 * @return {TreeNode}
 */
function TreeNode(val) {
  this.val = val;
  this.left = this.right = null;
}
/**
 * @param {number[]} inorder
 * @param {number[]} postorder
 * @return {TreeNode}
 */
var buildTree = function (inorder, postorder) {
  if(!postorder.length) return null
  const val = postorder[postorder.length - 1]
  const node = new TreeNode(val)
  const index = inorder.indexOf(val)
  node.left = buildTree(inorder.slice(0, index), postorder.slice(0, index))
  node.right = buildTree(inorder.slice(index + 1), postorder.slice(index, postorder.length - 1))
  return node
}

const res = buildTree([9,3,15,20,7], [9,15,7,20,3])
console.log('%c 🍧 res: ', 'font-size:20px;background-color: #465975;color:#fff;', res);
