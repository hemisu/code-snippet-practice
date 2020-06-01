// https://www.wolframalpha.com/input/?i=f%280%29+%3D+0%3B+f%27%280%29+%3D+0%3B+f%27%27%28t%29+%3D+-381.47%28f%28t%29+-+1%29+-+10.67f%27%28t%29
const e = 2.71828
function test1 () {
  let res = ''
  const lerp = (a, b, p) => a + p * (b - a)
  for(let i = 0; i <= 100; i++) {
    const t = i / 100
    let s = -0.28395 * (e **(-5.335 * t)) * Math.sin(18.7885 * t) - e**(-5.335*t) * Math.cos(18.7885 * t) + 1

    res += `
    ${i}% {
      transform: translate3d(0, ${lerp(0, 128/100, s)}rem, 0);
    }`
  }
  return res
}
function test2 () {
  let res = ''
  for(let i = 0; i <= 100; i++) {
    const t = i / 100
    let s = -0.28395 * (e **(-5.335 * t)) * Math.sin(18.7885 * t) - e**(-5.335*t) * Math.cos(18.7885 * t) + 1

    res += `
    ${i}% {
      transform: translate3d((${-s * 100} * @offsetFromLeft), 0, 0);
    }`
  }
  return res
}

console.log(test1())