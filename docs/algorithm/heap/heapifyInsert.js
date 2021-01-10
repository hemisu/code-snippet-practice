function Heap() {
  this.items = [,]
}

Heap.prototype.get = function () {
  return this.items
}

Heap.prototype.insert = function (val) {
  this.items.push(val)
  this.heapifyB2T()
}

// 堆化其实各有应用场景，自顶向下适合破坏堆顶后进行
Heap.prototype.heapifyT2B = function (i = 1) {
  const items = this.items
  while(true) {
    let maxIndex = i
    const leftLeaf = i * 2
    const rightLeaf = i * 2 + 1
    if(leftLeaf < items.length && items[i] < items[leftLeaf]) {
      maxIndex = leftLeaf
    }
    if(rightLeaf < items.length && items[maxIndex] < items[rightLeaf]) {
      maxIndex = rightLeaf
    }
    if(maxIndex === i) break;
    swap(items, maxIndex, i)
    i = maxIndex
  }
}

// 底向上适合加入新元素后进行
Heap.prototype.heapifyB2T = function (i = this.items.length - 1) {
  const items = this.items
  // 自下而上的堆化 在实际应用中，去除顶后再堆化无效果（无法进入循环）
  while(Math.floor(i / 2) > 0 && items[Math.floor(i / 2)] < items[i]) {
    swap(items, i, Math.floor(i / 2))
    i = Math.floor(i / 2)
  }
}

Heap.prototype.buildHeap = function() {
  // 使用自顶向下建堆，需要从最后一个非叶子节点开始
  // for(let i = Math.floor(this.items.length / 2); i >= 1; i--) {
  //   this.heapifyT2B(i)
  // }
  // 而使用自底向上建堆，需要从头开始刷新
  for(let i = 1; i < this.items.length; i++) {
    this.heapifyB2T(i)
  }
}

Heap.prototype.pop = function () {
  const items = this.items
  swap(items, 1, items.length - 1)
  const res = this.items.pop()
  this.heapifyT2B()

  return res
}

function swap(a, i, j) {
  [a[i], a[j]] = [a[j], a[i]]
}

const heap = new Heap()
console.log(heap.buildHeap())
heap.insert(6)
heap.insert(5)
heap.insert(4)
heap.insert(1)
heap.insert(3)
heap.insert(2)
heap.insert(8)
console.log(heap.get())
console.log(heap.pop())
console.log(heap.get())