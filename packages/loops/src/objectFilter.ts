export default function objectFilter<T extends Record<PropertyKey, any>>(
  obj: T,
  filter: (value: T[keyof T], key: keyof T, obj: T) => boolean
) {
  const filteredObj = {}

  for (const key in obj) {
    const value = obj[key]

    if (filter(value, key, obj)) {
      // @ts-ignore
      filteredObj[key] = value
    }
  }

  return filteredObj
}
