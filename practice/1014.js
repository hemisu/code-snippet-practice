/** 
通过 reduce 进行累加比对
通过 filter 进行 prev 的过滤
通过 indexOf 判断每次 filter 的时候 next 是否包含该元素
如果包含，那就 splice 删除它，记得返回一个数组，所以需要判断 .length
如果不包含，那就返回 false
*/
const commonChars = (A) => A
  .reduce(([...prev], [...next]) => 
    prev.filter((item) => next.indexOf(item) > -1 
      && next.splice(next.indexOf(item), 1).length)
  );
const res = commonChars([
  'bella',
  'lable',
  'roller'
])
console.log('%c 🥞 res: ', 'font-size:20px;background-color: #33A5FF;color:#fff;', res);