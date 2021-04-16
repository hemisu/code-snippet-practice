// https://labuladong.gitee.io/algo/%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E7%B3%BB%E5%88%97/%E9%80%92%E5%BD%92%E5%8F%8D%E8%BD%AC%E9%93%BE%E8%A1%A8%E7%9A%84%E4%B8%80%E9%83%A8%E5%88%86.html

// 单链表节点的结构
function ListNode(x) {
  this.next = null;
  this.val = x
}

// 递归反转整个链表
const reverse = head => {
  if (head.next === null) {
    return head
  }
  const last = reverse(head.next)
  head.next.next = head
  head.next = null
  return last
}

let successor = null
// 将链表的前 n 个节点反转（n <= 链表长度）
const reverseN = (head, n) => {
  if(n === 1) {
    // 记录第 n + 1 个节点
    successor = head.next
    return head
  }
  // 以 head.next 为起点，需要反转前 n - 1 个节点
  const last = reverseN(head.next, n - 1)
  head.next.next = head
  head.next = successor
  return last
}

function reverseBetween(head, m, n) {
  // base case
  if(m === 1) {
    // 反转前 n 个节点
    return reverseN(head, n)
  }
  // 前进到反转的起点 进行反转
  head.next = reverseBetween(head.next, m - 1, n - 1)
  return head
}
