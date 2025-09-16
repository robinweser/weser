export default function objectEach<T extends Record<PropertyKey, any>>(
  obj: T,
  iterator: (value: T[keyof T], key: keyof T, obj: T) => void
) {
  for (const key in obj) {
    iterator(obj[key], key, obj)
  }
}
