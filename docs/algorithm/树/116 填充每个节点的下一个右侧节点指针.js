const tree = {
  val: 1,
  left: {
    val: 2,
    left: {
      val: 4,
    },
    right: {
      val: 5,
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

// function connect(root) {
//   if (root == null || root.left == null) {
//       return root;
//   }

//   root.left.next = root.right;
//   connect(root.left);
//   connect(root.right);
//   return root;
// }


function connect(root) {
  if(root === null) return null
  connectTwoNode(root.left, root.right)
  return root
}
function connectTwoNode(left, right){
  if(!left || !right) return null

  left.next = right
  connectTwoNode(left.left, left.right)
  connectTwoNode(right.left, right.right)
  connectTwoNode(left.right, right.left)
}
connect(tree)
console.log(JSON.stringify(tree, null, 2))

// const connect = (root) => {
//   if (root == null) {
//     return root;
//   }
//   const dfs = (root) => {
//     if (root.left == null && root.right == null) {
//       return;
//     }
//     root.left.next = root.right
//     if(root.next) {
//       root.right.next = root.next.left
//     }
//     dfs(root.left);
//     dfs(root.right);
//   };
//   dfs(root);
//   return root;
// };
