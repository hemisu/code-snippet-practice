// 引申出什么是monad
const sine = x => Math.sin(x)
const cube = x => x ** 3

const compose = (f, g) => x => f(g(x))
// const sineOfCube = compose(sine, cube)


const sine1 = x => [Math.sin(x), 'sine was called.']

const cube1 = x => [x ** 3, 'cube was called.']

const composeDebuggable = (f, g) => x => {
  const [y, s] = g(x)
  const [z, t] = f(y)
  return [z, s + t]
}
const sineOfCube = composeDebuggable(sine1, cube1)
const y = sineOfCube(3)

// 但是按照上面的改造，会使原有的对称性symmetry失效，我们应该把它转化成对称的形式
// 构造bind函数：
// 接受一个 number => [number, string]
// 返回[number, string] => [number, string]

const bind = f => {
  return tuple => {
    const [y, s] = tuple
    const [z, t] = f(y)
    return [z, s + t]
  }
}

// 这时候我们可以用 bind 转化我们的函数
const f = compose(bind(sine1), bind(cube1))
// 此刻就拥有可组合的函数签名
const z = f([3, ''])

// 但是目前我们所有的函数需要有接受[number, string] 作为参数，其实我们更想只传一个number
// 除了转化函数以外，我们还需要一个函数可以把值转化成可接受的类型
// type Unit = (x: number) => [number, string]
// Unit的作用就是接收一个值，然后将其包装于一个基本容器，这个基本容器指的是我们正在使用的函数可以消费的类型
const unit = x => [x, '']
const z1 = f(unit(3))
const z2 = compose(f, unit)(3)
// lift 接收一个 number => number 的函数作为参数，并且返回一个number => [number, string]
const list = f => x => unit(f(x))
const list = f => compose(unit, f)

// 小结，抽象了3个用于粘合debuggable函数的抽象
// lift 将简单函数转化为debuggable函数
// bind 可以把一个debuggable函数转化为可组合的形式
// unit 可以把一个简单值放到一个容器中，转化为debuggable函数所需的形式

// =================== 实战分割线 =============================
// 现在有一个函数，功能是接收DOM node 作为参数，并且以数组的形式返回它的children
// type Children = node => [...node.childNodes]
const children = node => [...node.childNodes]

const heading = document.getElementsByTagName('h3')[0];
children(heading)

// 现在假设需要找到Heading的grandchildren 即它的children的children
// const grandChildren = compose(children, children)
// 可知children的输出输出不堆对称，不能简单的compose起来
// 如果手写一个 grandChildren = (node: HTMLElment) => HTMLElement[]
const grandChildren = node => {
  const childs = children(node)
  let res = []
  for(let i = 0, n = childs.length; i < n ; i++) {
    res = res.concat(children(childs[i]))
  }
  return res
}
// type Unit = <T>(x: T) => T[]
// 接受一个item返回一个包含这个item的数组
const unit1 = x => [x]

// type Bind = <T>(f: (x: T) => T[]) => (list: T[]) => T[]
// unit :: a -> [a]
// bind :: (a -> [a]) -> ([a] -> [a])
// 接受一个一对多函数，返回一个多对多函数
const bind1 = f => list => {
  let res = []
  for(let i = 0, n = list.length; i < n; i++) {
    res = res.concat(f(list[i]))
  }
  return res
}

const div = document.getElementsByTagName('div')[0]
const grandChildren2 = compose(bind1(children), bind1(children))

grandChildren2(unit1(div))

// 这部分就是Haskell里的list monad 它可以让我们compose一对多的函数
// monad就是一个设计模式，它表明：
// 当你拥有一类函数F，这类函数都接受一种类型值A并返回另一种类型的值B：我们就可以在这一类函数F上应用两个函数，使他们可组合
// 1. bind 函数： 转换 F 使其输入和输出是一样的，目的是使其 可组合(composable)
// 2. unit 函数： 转换 类型 A 的值包装到一个容器中，使得这个值可以被一个可组合函数(composable function) 所接受

// bind可以把 F 类函数应用到 unit 给出的容器上

// bind (>>==) :: m a -> (a -> m b) -> m b
// then (>>) :: m a-> m b -> m b
// return (unit) :: a -> m a
// fail :: String -> m a

// reference:
// 原文 <https://blog.jcoglan.com/2011/03/05/translation-from-haskell-to-javascript-of-selected-portions-of-the-best-introduction-to-monads-ive-ever-read/>
// 译文 <https://zhuanlan.zhihu.com/p/94859885> 

// monads in javascript
// <https://curiosity-driven.org/monads-in-javascript>