export default function arrayMap<T>(
  arr: Array<T>,
  mapper: (value: T, index: number, length: number, array: Array<T>) => any
) {
  const mappedArr = []

  for (let i = 0, len = arr.length; i < len; ++i) {
    mappedArr.push(mapper(arr[i], i, len, arr))
  }

  return mappedArr
}
