/**
 * Definition for a binary tree node.
 * 前序遍历 preorder = [3,9,20,15,7]
   中序遍历 inorder = [9,3,15,20,7]
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
function TreeNode(val) {
  this.val = val;
  this.left = this.right = null;
}
/**
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode}
 */
var buildTree = function (preorder, inorder) {
  if(!preorder.length) return null
  const node = new TreeNode(preorder[0])
  const i = inorder.indexOf(preorder[0])
  node.left = buildTree(preorder.slice(1, i + 1), inorder.slice(0, i))
  node.right = buildTree(preorder.slice(i + 1), inorder.slice(i + 1))
  return node
}
const res = buildTree([3,9,20,15,7], [9,3,15,20,7])
console.log('%c 🍣 res: ', 'font-size:20px;background-color: #465975;color:#fff;', res);

