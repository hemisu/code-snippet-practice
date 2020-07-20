var searchInsert = function(nums, target) {
  // 二分查找
  let l = 0;
  let r = nums.length - 1
  while (l <= r) {
      const mid = (l + r) >> 1
      if (nums[mid] === target) return mid
      else if (nums[mid] < target) {
          l = mid + 1
      } else {
          r = mid - 1
      }
  }
  return l
};
searchInsert([1,3,5,6], 7)