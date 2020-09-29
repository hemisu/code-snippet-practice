const assert = require('assert')
/**
 * 输入: [1,null,2,3]  
   1
    \
     2
    /
   3 
 */
/**
 * Definition for a binary tree node.
 */
function TreeNode(val, left, right) {
  this.val = (val===undefined ? 0 : val)
  this.left = (left===undefined ? null : left)
  this.right = (right===undefined ? null : right)
}

const exampleRoot = {
  val: 1,
  left: null,
  right: {
    val: 2,
    left: {
      val: 3,
      left: null,
      right: null
    },
    right: null,
  }
}

/**
 * 前序
 * @param {TreeNode} root
 * @return {number[]}
 */
var preorderTraversal = function(root) {
  const res = []
  const stack = []

  while (stack.length || root) {
    if(root) {
      res.push(root.val)
      if(root.left) {
        stack.push(root.left)
      }
      root = root.right
    } else {
      root = stack.pop()
    }
  }
  return res
}

const preorderRes = preorderTraversal(exampleRoot)
assert.deepStrictEqual(preorderRes, [1, 2, 3], '前序迭代')

var inorderTraversal = function(root) {
  const res = []
  const stack = []

  while (stack.length || root) {
    if(root) {
      stack.push(root)
      root = root.left
    } else {
      root = stack.pop()
      res.push(root.val)
      root = root.right
    }
  }
  return res
}


const inorderRes = inorderTraversal(exampleRoot)
assert.deepStrictEqual(inorderRes, [1, 3, 2], '中序迭代')
/**
 * 后序
 * 
 * 由前序迭代转变而来
 * 前序： root -> left - right
 * 1. 首先改变插入res的方式，改成res.unshift()
 *    此时结果会变成 right -> left -> root
 * 2. 改变left right顺序即可
 * @param {TreeNode} root
 * @return {number[]}
 */
var postorderTraversal = function(root) {
  const res = []
  const stack = []

  while (stack.length || root) {
    if(root) {
      res.unshift(root.val)
      if(root.right) {
        stack.push(root.right)
      }
      root = root.left
    } else {
      root = stack.pop()
    }
  }
  return res
}

const postorderRes = postorderTraversal(exampleRoot)

assert.deepStrictEqual(postorderRes, [3, 2, 1], '后序迭代')

