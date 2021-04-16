// https://labuladong.gitee.io/algo/%E9%AB%98%E9%A2%91%E9%9D%A2%E8%AF%95%E7%B3%BB%E5%88%97/k%E4%B8%AA%E4%B8%80%E7%BB%84%E5%8F%8D%E8%BD%AC%E9%93%BE%E8%A1%A8.html
// https://leetcode-cn.com/problems/reverse-nodes-in-k-group/submissions/
const reverse = (a, b) => {
  let pre, cur, next;
  pre = null; cur = a, next = a
  while(cur !== b) {
    next = cur.next
    cur.next = pre
    pre = cur
    cur = next
  }
  return pre
}

const reverseKGroup = (head, k) => {
  if(head === null) return null
  let a, b
  a = b = head
  // 往后找k个
  for(let i = 0; i < k; i++) {
    if(b === null) return head
    b = b.next
  }
  let newHead = reverse(a, b)
  a.next = reverseKGroup(b, k)
  return newHead
}
