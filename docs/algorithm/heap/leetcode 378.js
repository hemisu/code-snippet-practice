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
    if(leftLeaf < items.length && items[i].val > items[leftLeaf].val) {
      maxIndex = leftLeaf
    }
    if(rightLeaf < items.length && items[maxIndex].val > items[rightLeaf].val) {
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
  while(Math.floor(i / 2) > 0 && items[Math.floor(i / 2)].val > items[i].val) {
    swap(items, i, Math.floor(i / 2))
    i = Math.floor(i / 2)
  }
}

Heap.prototype.buildHeap = function() {
  // 使用自底向上建堆，需要从最后一个非叶子节点开始
  // for(let i = Math.floor(this.items.length / 2); i >= 1; i--) {
  //   this.heapifyT2B(i)
  // }
  // 而使用自顶向下建堆，需要从头开始刷新
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

const matrix = [
  [ 1,  5,  9],
  [10, 11, 13],
  [12, 13, 15]
];

const k = 8;

var kthSmallest = function(matrix, k) {
  // n x n 矩阵
  const n = matrix.length
  const heap = new Heap()
  // 我们设计一个结构，方便取出后放入下一个矩阵元素
  const unit = (val, i, j) => ({ val, i, j })
  // 接着放入有序矩阵的第一列
  for(let i = 0; i < n ; i++) {
    heap.insert(unit(matrix[i][0], i, 0))
  }
  // 这里一共弹 k - 1 次, 最后一次在return的时候弹出
  for(let i = 0 ;i < k - 1 ; i++) {
    console.log(heap.get().map(_ => _.val))
    const { val, i: x, j: y } = heap.pop()
    if(y !== n - 1) {
      // 说明这一行还没被弹完
      heap.insert(unit(matrix[x][y + 1], x, y + 1))
    }
  }
  return heap.pop().val
}
console.log(kthSmallest(matrix, 8))
// const heap = new Heap()
// heap.insert({ val: 6 })
// heap.insert({ val: 5 })
// heap.insert({ val: 4 })
// heap.insert({ val: 1 })
// heap.insert({ val: 3 })
// heap.insert({ val: 2 })
// heap.insert({ val: 8 })
// console.warn('heap.get()', JSON.stringify(heap.get(), null, 2));
// console.log(heap.pop())
// console.warn('heap.get()', JSON.stringify(heap.get(), null, 2));