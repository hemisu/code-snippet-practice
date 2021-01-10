class Heap {
  constructor(...args) {
    this.heap = [, ...args]
  }

  /**
   * 比较函数
   * @param {*} parent 
   * @param {*} child 
   */
  compare(parent, child) {
    const parentLen = parent[0] * parent[0] + parent[1] * parent[1]
    const childLen = child[0] * child[0] + child[1] * child[1]
    return parentLen > childLen
  }

  buildHeap() {
    for(let i = 1; i < this.heap.length; i++) {
      this.buildHeapB2T(i)
    }
    // for(let i = Math.floor(this.heap.length / 2); i >= 1; i--) {
    //   this.buildHeapT2B(i)
    // }
  }

  buildHeapB2T(i) {
    while(Math.floor(i / 2) > 0 && this.compare(this.heap[Math.floor(i / 2)], this.heap[i])) {
      this.swap(Math.floor(i / 2), i)
      i = Math.floor(i / 2)
    }
  }

  buildHeapT2B(i) {
    const items = this.heap
    while(true) {
      let maxIndex = i
      const leftLeaf = i * 2
      const rightLeaf = i * 2 + 1
      if(leftLeaf < items.length && this.compare(items[i], items[leftLeaf])) {
        maxIndex = leftLeaf
      }
      if(rightLeaf < items.length && this.compare(items[maxIndex], items[rightLeaf])) {
        maxIndex = rightLeaf
      }
      if(maxIndex === i) break;
      this.swap(maxIndex, i)
      i = maxIndex
    }
  }

  swap(a, b) {
    [this.heap[a], this.heap[b]] = [this.heap[b], this.heap[a]]
  }

  pop() {
    this.swap(1, this.heap.length - 1) // 放到最后面
    const res = this.heap.pop()
    this.buildHeapT2B(1) // 重新建堆
    return res
  }
}

const heap = new Heap(...[[1,3],[-2,2]])
heap.buildHeap()
console.log(heap.pop())