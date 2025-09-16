export default function arrayFilter<T>(
  arr: Array<T>,
  filter: (value: T, index: number, length: number, array: Array<T>) => boolean
) {
  const filteredArr = []

  for (let i = 0, len = arr.length; i < len; ++i) {
    const value = arr[i]

    if (filter(value, i, len, arr)) {
      filteredArr.push(value)
    }
  }

  return filteredArr
}
