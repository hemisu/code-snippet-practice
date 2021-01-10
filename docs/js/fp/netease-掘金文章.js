
const Box = x => ({
  map: f => Box(f(x)),
  fold: f => f(x),
  inspect: () => `Box(${x})`
})

const finalPrice = str =>
  Box(str)
      .map(x => x * 2)
      .map(x => x * 0.8)
      .map(x => x - 50)

const result = finalPrice(100)

const partial =
    (fn, ...presetArgs) =>
        (...laterArgs) =>
            fn(...presetArgs, ...laterArgs);

const double = n => n * 2
const map = (fn, F) => F.map(fn)
const mapDouble = partial(map, double)

const res = mapDouble(Box(1)).fold(x => x)
// console.log(res)  // => 2
// console.log(result.inspect()) // => Box(110)

const addOne = x => x + 1
Box(addOne)
