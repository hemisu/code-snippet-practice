/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
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
  if (!preorder.length) return null
  const node = new TreeNode(preorder[0])
  const i = inorder.indexOf(preorder[0])
  node.left = buildTree(preorder.slice(1, i + 1), inorder.slice(0, i))
  node.right = buildTree(preorder.slice(i + 1), inorder.slice(i + 1))
  return node
}
const tree = buildTree([1, 2, 4, 3, 2, 4, 4], [1, 4, 2, 4, 2, 3, 4])

const memo = new Map()
const res = []
/**
 * @param {TreeNode} root
 * @return {TreeNode[]}
 */
var findDuplicateSubtrees = function (root) {
  traverse(root)
  return res
};

function traverse(root) {
  if(!root) return '#'
  const l = traverse(root.left)
  const r = traverse(root.right)
  const str = l + ',' + r + ',' + root.val

  const flag = memo.get(str)
  if (flag === 1) res.push(root)
  memo.set(str, (flag || 0) + 1)
  return str
}

const res1 = findDuplicateSubtrees(tree)
console.log('%c 🍥 res1: ', 'font-size:20px;background-color: #F5CE50;color:#fff;', res1);