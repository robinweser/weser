import { objectReduce } from 'fast-loops'

function makeResponsiveTransform(transform: (value: any) => any) {
  return (value: any) => {
    if (Array.isArray(value)) {
      return value.map(transform)
    }
    if (value && typeof value === 'object') {
      return objectReduce(
        value,
        (out, val, key) => {
          out[key] = transform(val)
          return out
        },
        {} as Record<keyof typeof value, any>
      )
    }

    return transform(value)
  }
}

export default function applyMultiplier(factor: number = 1) {
  return makeResponsiveTransform((value: any) => {
    if (value === undefined || value === null) {
      return undefined
    }

    if (typeof value !== 'number') {
      return value
    }

    return value * factor
  })
}
