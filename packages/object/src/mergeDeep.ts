export default function mergeDeep(
  base: Record<PropertyKey, any>,
  ...objs: Array<Record<PropertyKey, any>>
) {
  for (let i = 0, len = objs.length; i < len; ++i) {
    const obj = objs[i]

    for (const key in obj) {
      // see https://github.com/robinweser/fast-loops/issues/18
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        continue
      }

      const value = obj[key]

      if (
        typeof value === 'object' &&
        !Array.isArray(value) &&
        value !== null
      ) {
        base[key] = mergeDeep(base[key], value)
        continue
      }

      base[key] = value
    }
  }

  return base
}
