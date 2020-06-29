const swap = (a, i, j) => [a[i], a[j]] = [a[j], a[i]]
function _quickSort(nums, l, r) {
  if (l >= r) {
    return
  }
  const p = partition(nums, l, r)
  partition(nums, l, p - 1)
  partition(nums, p + 1, r)
}
const partition = (nums, l, r) => {
  const rdmIndex = Math.floor(Math.random() * (r - l + 1) + l) // 优化随机选择
  swap(nums, rdmIndex, l) // 避免有序数组退化为O2复杂度
  let j = l
  for (let i = l + 1; i <= r; i++) {
    if (nums[l] > nums[i]) {
      swap(nums, i, j + 1)
      j++
    }
  }
  swap(nums, j, l)
  return j
}

var items = [5, 2, 3, 4, 1]
_quickSort(items, 0, items.length - 1)
console.log(items)

const quickSort = ([pivot, ...arr]) => pivot === undefined
  ? [] : 
  [...quickSort(arr.filter(_ => (_ < pivot))), pivot, ...quickSort(arr.filter(_ => (_ > pivot)))]
console.log(quickSort([1, 5,7,2,6,3]))