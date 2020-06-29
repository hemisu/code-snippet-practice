// 测试 自顶向下 对比节点和子节点
// 注意开始的节点需要是第一个非叶子节点，也就是items[Math.floor(items.length / 2)]的位置
var items = [,5, 2, 3, 4, 1]
// 因为 items[0] 不存储数据
// 所以：heapSize = items.length - 1
buildHeap(items, items.length - 1)
console.log(items)
// [empty, 1, 2, 3, 4, 5]

function buildHeap(items, heapSize) {
  for(let i = Math.floor(heapSize / 2); i > 0; i--) {
    heapify(items, heapSize, i)
  }
}

function heapify(items, heapSize, i) {
  while(true) {
    let minIndex = i
    const lLeaf = i * 2
    const rLeaf = i * 2 + 1
    // 父节点大于左子节点
    if(lLeaf <= heapSize && items[minIndex] > items[lLeaf]) {
      minIndex = lLeaf
    }
    // 父节点大于右子节点
    if(rLeaf <= heapSize && items[minIndex] > items[rLeaf]) {
      minIndex = rLeaf
    }
    if(minIndex === i) break;
    swap(items, i, minIndex)
    // 自顶向下
    i = minIndex
  }
}

function swap(items, i, j) {
  [items[i], items[j]] = [items[j], items[i]]
}