export default function arrayEach<T>(
  arr: Array<T>,
  iterator: (value: T, index: number, length: number, array: Array<T>) => void
) {
  for (let i = 0, len = arr.length; i < len; ++i) {
    iterator(arr[i], i, len, arr)
  }
}
