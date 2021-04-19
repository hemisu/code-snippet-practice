const str = 'bbaabb1'

const palindrome = (s, l, r) => {
  // 防止索引越界
  while (l >= 0 && r < s.length
    && s[l] == s[r]) {
    // 向两边展开
    l--; r++;
  }
  // 返回以 s[l] 和 s[r] 为中心的最长回文串
  return s.slice(l + 1, r - l - 1);
}

// const res = palindrome(str, 2, 3)

// const isPalindrome = (s) => {
//   let left = 0, right = s.length - 1;
//   while (left < right) {
//       if (s[left] != s[right])
//           return false;
//       left++; right--;
//   }
//   return true;
// }

// const res = isPalindrome(str)

/**
 * 单链表节点的定义：
 * function ListNode(x) {
 *   this.next = null;
 *   this.val = x
 * }
 */

// const isPalindrome = head => {

// }

/* 倒序打印单链表中的元素值 */
function traverse(head) {
  if (head == null) return;
  traverse(head.next);
  // 后序遍历代码
  console.log(head.val);
}

const list = {
  val: 1,
  next: {
    val: 2,
    next: {
      val: 3,
      next: {
        val: 3,
        next: {
          val: 2,
          next: {
            val: 1,
            next: null
          }
        }
      }
    }
  }
}


// 左侧指针
let left;

function isPalindrome(head) {
  left = head;
  return traverse(head);
}

function traverse(right) {
  if (right == null) return true;
  let res = traverse(right.next);
  // 后序遍历代码
  res = res && (right.val == left.val);
  left = left.next;
  return res;
}


// const res1 = isPalindrome(list)
// console.log(res1)


// 优化空间思路
function isPalindrome2(head) {
  let slow, fast, p, q;
  slow = fast = head;
  while (fast != null && fast.next != null) {
    p = slow
    q = fast
    slow = slow.next;
    fast = fast.next.next;
  }
  // 如果是奇数，再往前一步
  if (fast != null) {
    p = slow
    slow = slow.next;
  } else {
    // 如果是偶数
    q = q.next
  }
  // slow 指针现在指向链表中点
  // 奇数
  // 1 - 2 - 3 - 2 - 1 - null
  //         p           q 
  // 偶数
  // 1 - 2 - 3 3 - 3 - 2 - 1 - null
  //         p         q       fast  所以要再往前一步
  console.log('p: ', JSON.stringify(p))
  console.log('q: ', JSON.stringify(q))
  
  let left = head
  let right = reverse(slow)
  while(right !== null) {
    if(left.val !== right.val) return false
    left = left.next
    right = right.next
  }
  // 复原链表
  p.next = reverse(q)
  return true
}

function reverse(head) {
  let pre, cur, next
  pre = null, cur = head, next = head
  while(cur !== null) {
    next = cur.next
    cur.next = pre
    pre = cur
    cur = next
  }
  return pre
}

const a = isPalindrome2(list)
console.log(a, JSON.stringify(list))