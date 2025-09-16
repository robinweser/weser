export default function objectFind<T extends Record<PropertyKey, any>>(
  obj: T,
  query: (value: T[keyof T], key: keyof T, obj: T) => boolean
) {
  for (const key in obj) {
    if (query(obj[key], key, obj)) {
      return key
    }
  }
}
