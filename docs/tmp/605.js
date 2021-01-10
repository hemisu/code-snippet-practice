var canPlaceFlowers = function(flowerbed, n) {
  // [1,0,0,0,1]
  // [1,0,1,0,1] , [1, 0]
  // 不打破种植规则 如何不打破？ 隔一个种
  // 000 可以种1株 010
  // 00000 可以种2株 01010
  // 5->2 7->3 可以种 (n - 1)/2 株
  // 统计连续的0
  let res = 0
  flowerbed.unshift(0)
  flowerbed.push(0)
  let maxContinuesZero = 0
  let juedgePlan = x => Math.floor(x / 2) 

  for(let i = 1; i < flowerbed.length; i++) {
    
    if(flowerbed[i] === 0 && flowerbed[i - 1] === flowerbed[i]) {
      console.log('i:', i, maxContinuesZero)
      maxContinuesZero++
    }
    else {
      console.log('i:', i, maxContinuesZero)
      if(maxContinuesZero > 0) res += juedgePlan(maxContinuesZero)
      maxContinuesZero = 0
    }
  }
  if(maxContinuesZero > 0) res += juedgePlan(maxContinuesZero)
  return n <= res
};
// return canPlaceFlowers(
//   [1,0,0,0,1,0,0],
//   2
// )
return canPlaceFlowers(
  [0,0,1,0,1],
  1
)