export default function arrayReduce<T, B>(
  arr: Array<T>,
  reducer: (
    accumulator: B,
    value: T,
    index: number,
    length: number,
    array: Array<T>
  ) => B,
  initialValue: B
) {
  for (let i = 0, len = arr.length; i < len; ++i) {
    initialValue = reducer(initialValue, arr[i], i, len, arr)
  }

  return initialValue
}
