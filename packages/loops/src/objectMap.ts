export default function objectMap<T extends Record<PropertyKey, any>, R>(
  obj: T,
  mapper: <K extends keyof T>(value: T[K], key: K, obj: T) => R
) {
  const mappedObj = {}

  for (const key in obj) {
    // @ts-ignore
    mappedObj[key] = mapper(obj[key], key, obj)
  }

  return mappedObj as Record<keyof T, R>
}
