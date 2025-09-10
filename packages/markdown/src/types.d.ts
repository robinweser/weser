declare module 'fast-loops' {
  export function arrayReduce<T, B>(
    arr: Array<T>,
    reducer: (accumulator: B, value: T, index: number) => B,
    B
  )

  export function arrayMap<T>(
    arr: Array<T>,
    mapper: (item: T, index: number) => B
  )
}

declare module 'gray-matter' {
  export default function matter<MetaData = any>(
    markdown: string
  ): {
    data: MetaData
    content: string
  }
}
