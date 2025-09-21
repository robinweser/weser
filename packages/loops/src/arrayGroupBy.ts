export default function arrayGroupBy<T extends Record<string, any>>(
  arr: Array<T>,
  key: keyof T
) {
  return arr.reduce(
    (grouped, item) => {
      grouped[item[key]] = grouped[item[key]] || []
      grouped[item[key]].push(item)

      return grouped
    },
    {} as Record<Array<T>[number][keyof T], Array<T>>
  )
}
