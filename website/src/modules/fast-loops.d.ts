declare module 'fast-loops' {
  export function arrayMap<T, B>(
    arr: Array<T>,
    reducer: (value: T, index: number) => B
  ): Array<B>

  export function arrayReduce<T, B>(
    arr: Array<T>,
    reducer: (accumulator: B, value: T, index: number) => B,
    initial: B
  ): B

  export function objectReduce<T extends Record<PropertyKey, any>, B>(
    obj: T,
    reducer: (
      accumulator: B,
      value: T[keyof T],
      key: keyof T,
      index: number
    ) => B,
    initial: B
  ): B

  export function objectMap<T extends Record<PropertyKey, any>, R>(
    obj: T,
    mapper: <K extends keyof T>(value: T[K], key: K, obj: T) => R
  ): { [K in keyof T]: R }

  export declare function objectFilter<T extends Record<PropertyKey, any>>(
    obj: T,
    filter: (value: T[keyof T], key: keyof T, obj: T) => boolean
  ): T
}
