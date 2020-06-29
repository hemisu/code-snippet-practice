function Heap() {
  this.items = [,]
}
Heap.prototype.get = function () {
  return this.items
}
Heap.prototype.insert = function (val) {
  this.items.push(val)
  const items = this.items
  let i = this.items.length - 1
  while(Math.floor(i / 2) > 0 && this.items[Math.floor(i / 2)] < this.items[i]) {
    swap(this.items, i, Math.floor(i / 2))
    i = Math.floor(i / 2)
  }
}

function swap(a, i, j) {
  [a[i], a[j]] = [a[j], a[i]]
}

const heap = new Heap()
console.log(heap)
heap.insert(6)
heap.insert(5)
heap.insert(4)
heap.insert(1)
heap.insert(3)
heap.insert(2)
heap.insert(8)
console.log(heap.get())
