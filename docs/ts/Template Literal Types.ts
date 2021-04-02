/*
当他们在这里说裸时，表示存在类型参数而没有将其包装在另一个类型中(例如，数组，元组，函数，promise或任何其他泛型类型)

例如:
*/
type NakedUsage<T> = T extends boolean ? "YES" : "NO"
type WrappedUsage<T> = [T] extends [boolean] ? "YES" : "NO"; // wrapped in a tuple

// 裸vs非裸的重要性很重要的原因是裸用法在一个联合上分布，这意味着条件类型适用于联合的每个成员，并且结果将是所有应用程序的联合
type Distributed = NakedUsage<number | boolean> // = NakedUsage<number> | NakedUsage<boolean> =  "NO" | "YES" 
type NotDistributed = WrappedUsage<number | boolean> // "NO"    
type NotDistributed2 = WrappedUsage<boolean> // "YES"

// =====
type StringKeyof<T> = Exclude<keyof T, symbol>
type CombineStringKey<H extends string | number, L extends string | number> = H extends '' ? `${L}` : `${H}.${L}`
const symbol1 = Symbol()

type A = {
  1: string
  a: string
  [symbol1]: string
}

type K = StringKeyof<A>

type B = CombineStringKey<'', 'a'>
type C = CombineStringKey<B, 'b'>

// 联合类型如何变为交叉类型
type UnionToIntersection<U> =
  (U extends any ? (k: U) => void : never) extends
  ((k: infer V) => void) ? V : never;

type NameType<T> = T extends { name: infer N } ? N : never;
type res = NameType<{name: 'yj'}>

type A1 = {
  0: 1,
  1: 2,
  2: '3',
  3: '4'
}
type Filtler<T extends Record<string,any>, Condition> = {
  [K in keyof T]: T[K] extends Condition ? T[K] : never
}[keyof T]
type B1 = Filtler<A1, string>

// type BB = { a: number } | { a: string } // 协变
// type BC = { a: number } & { a: string } // 逆变 如果两个交集进行逆变得到never
// type BD = number & string
// const bc: BB = {
//   a: 123
// }

type T = { a: number } | { b: string }
type V = keyof T // never
type D = UnionToIntersection<T>

type ChainKeys<T, P extends string | number = ''> = UnionToIntersection<{
  [K in StringKeyof<T>]: T[K] extends Record<any, any>
  ? Record<CombineStringKey<P, K>, T[K]> & ChainKeys<T[K], CombineStringKey<P, K>>
  : Record<CombineStringKey<P, K>, T[K]>
}[StringKeyof<T>]>

type testKeyof = {a: string, b: string, c: string}['a' | 'b' | 'c']

type deepObj = {
  a: number;
  b: {
    c: string;
    d: number;
    e: {
      f: number;
      g: boolean;
    };
  };
}

type R = ChainKeys<deepObj>



function getValueByPath<T extends Record<any, any>, K extends keyof ChainKeys<T>>(object: T, prop: K): ChainKeys<T>[K] {
  prop = prop || '';
  const paths = prop.split('.');
  let current = object;
  let result = null;
  for (let i = 0, j = paths.length; i < j; i++) {
    const path = paths[i];
    if (!current) break;

    if (i === j - 1) {
      result = current[path];
      break;
    }
    current = current[path];
  }
  return result;
}
const a = getValueByPath({ a: 1, b: true }, 'a')
const b = getValueByPath({ a: 1, b: { c: '123',  e: {f: 20, g: true, z: 'aaa', d: new Date(), e: (name: string, age: number):void => {} }} }, 'b.e.e')


interface FooParams {
  type: 'foo';
  value: string;
}

interface BarParams {
  type: 'bar';
  value: number;
}

type Params = FooParams | BarParams;

function test1<TParams extends Params>(
  type: TParams['type'],
  value: TParams['value'],
): void {}



type UnionToIntersection1<T> = 
  (T extends any ? (x: T) => any : never) extends
  (k: infer K) => any ? K : never


type test2 = UnionToIntersection1<T>

type Ctor<T> = { new(...args: any[]): T}
declare function mixin<T extends Ctor<any>[]>(...traits: T):
    Ctor<UnionToIntersection<InstanceType<T[number]>>>

class Flyable { 
    fly() { }
}
class Walkable {
    walk() {}
}

class Mixed extends mixin(Flyable, Walkable) {
    test() {
        this.fly() // ok
        this.walk() // ok
    }
}
