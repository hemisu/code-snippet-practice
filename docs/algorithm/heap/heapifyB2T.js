// 堆化 自底向上
// 比对的是节点与父节点，堆大小不断扩大，扩大后再用while不断向上
// 测试
var items = [,5, 2, 3, 4, 1]
// 初始有效序列长度为 1
buildHeap(items, 1)
console.log(items)
// [empty, 1, 2, 3, 5, 4]

function buildHeap(items, heapSize) {
  while(heapSize < items.length - 1) {
    heapSize++
    heapify(items, heapSize)
  }
}

function heapify(items, i) {
  while(Math.floor(i / 2) > 0 && items[i] < items[Math.floor(i / 2)]) {
    swap(items, i, Math.floor(i / 2))
    i = Math.floor(i / 2)
  }
}

function swap(items, i, j) {
  [items[i], items[j]] = [items[j], items[i]]
}