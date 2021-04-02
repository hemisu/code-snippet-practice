/*
当他们在这里说裸时，表示存在类型参数而没有将其包装在另一个类型中(例如，数组，元组，函数，promise或任何其他泛型类型)

例如:
*/
type NakedUsage<T> = T extends boolean ? "YES" : "NO"
type WrappedUsage<T> = [T] extends [boolean] ? "YES" : "NO"; // wrapped in a tuple

// 裸vs非裸的重要性很重要的原因是裸用法在一个联合上分布，这意味着条件类型适用于联合的每个成员，并且结果将是所有应用程序的联合
type Distributed = NakedUsage<number | boolean > // = NakedUsage<number> | NakedUsage<boolean> =  "NO" | "YES" 
type NotDistributed = WrappedUsage<number | boolean > // "NO"    
type NotDistributed2 = WrappedUsage<boolean > // "YES"

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
  (U extends any ? (k: U) => void: never) extends
  ((k: infer I) => void) ? I : never;

type T = { a: number } | { b: string }
type V = keyof T // never
type D = UnionToIntersection<T>

type ChainKeys<T, P extends string | number = ''> = UnionToIntersection<{
  [K in StringKeyof<T>]: T[K] extends Record<any, any> 
    ? Record<CombineStringKey<P, K>, T[K]> & ChainKeys<T[K], CombineStringKey<P, K>>
    : Record<CombineStringKey<P, K>, T[K]>
}[StringKeyof<T>]>

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



function getValueByPath<T extends Record<any, any>, K extends keyof T>(object: T, prop: K): T[K] {
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
const b = getValueByPath({ a: 1, b: true }, 'b')