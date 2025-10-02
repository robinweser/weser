export default function arrayGroupBy<T extends Record<string, any>>(
  arr: Array<T>,
  key: keyof T | ((item: T) => string)
) {
  return arr.reduce(
    (grouped, item) => {
      const group = typeof key === 'function' ? key(item) : item[key]

      grouped[group] = grouped[group] || []
      grouped[group].push(item)

      return grouped
    },
    {} as Record<string, Array<T>>
  )
}
