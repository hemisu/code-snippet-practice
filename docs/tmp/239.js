var maxSlidingWindow = function(nums, k) {
  const res = []
  for(let i = k; i <= nums.length; i++) {
    const tmp = nums.slice(i - k, i)
    res.push(Math.max(...tmp))
  }
  console.log('res:', res)
  return res
};

maxSlidingWindow(
  [1,3,-1,-3,5,3,6,7],
  3
)