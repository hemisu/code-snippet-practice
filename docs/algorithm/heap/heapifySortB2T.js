var items = [,5, 2, 3, 4, 1]
// 初始有效序列长度为 1
heapSort(items)
function heapSort(items) {
  for(let j = items.length - 1; j >= 1; j--) {
    buildHeap(items, 1, j)
    // 交换
    swap(items, 1, j)
  }

  console.log(items)
}

function buildHeap(items, heapSize, length) {
  while(heapSize < length) {
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