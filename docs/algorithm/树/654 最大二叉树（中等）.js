/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 *
/**
 * 主函数
 * @param {number[]} nums
 * @return {TreeNode}
 */
var constructMaximumBinaryTree = function (nums) {
  return build(nums, 0, nums.length - 1)
};

function TreeNode(val, left, right) {
  this.val = (val === undefined ? 0 : val)
  this.left = (left === undefined ? null : left)
  this.right = (right === undefined ? null : right)
}

function build(nums, lo, hi) {
  if (lo > hi) return null

  let index = -1, maxVal = Number.MIN_SAFE_INTEGER
  for (let i = lo; i <= hi; i++) {
    if (maxVal < nums[i]) {
      index = i;
      maxVal = nums[i]
    }
  }

  const root = new TreeNode(maxVal)
  root.left = build(nums, lo, index - 1)
  root.right = build(nums, index + 1, hi)

  return root
}

const r = constructMaximumBinaryTree([3, 2, 1, 6, 0, 5])

console.log('%c 🍈 r: ', 'font-size:20px;background-color: #4b4b4b;color:#fff;', r);