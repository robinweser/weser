export default function objectReduce<T extends Record<PropertyKey, any>, B>(
  obj: T,
  reducer: (accumulator: B, value: T[keyof T], key: keyof T, obj: T) => B,
  initialValue: B
) {
  for (const key in obj) {
    initialValue = reducer(initialValue, obj[key], key, obj)
  }

  return initialValue
}

const obj = { a: 1, b: 2, c: 3 }

const reducedObj = objectReduce(
  obj,
  (acc, val, key) => {
    acc[key] = val
    return acc
  },
  {} as Record<keyof typeof obj, any>
)

console.log(reducedObj)
