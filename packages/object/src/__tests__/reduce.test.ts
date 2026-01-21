import { describe, test, expect } from 'vitest'

import reduce from '../reduce'

describe('reduce', () => {
  test('reduces with accumulator', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = reduce(obj, (acc, value) => acc + value, 0)

    expect(result).toBe(6)
  })

  test('uses initial value', () => {
    const obj = { a: 1, b: 2 }
    const result = reduce(obj, (acc, value) => acc + value, 10)

    expect(result).toBe(13)
  })

  test('provides key to reducer', () => {
    const obj = { a: 1, b: 2 }
    const keys: string[] = []

    reduce(
      obj,
      (acc, _, key) => {
        keys.push(key as string)
        return acc
      },
      null
    )

    expect(keys).toEqual(['a', 'b'])
  })

  test('provides reference to original object', () => {
    const obj = { a: 1 }
    let receivedObj: typeof obj | undefined

    reduce(
      obj,
      (acc, _, __, o) => {
        receivedObj = o
        return acc
      },
      null
    )

    expect(receivedObj).toBe(obj)
  })

  test('handles empty object', () => {
    const obj = {}
    const result = reduce(obj, (acc) => acc + 1, 0)

    expect(result).toBe(0)
  })

  test('can reduce to different type', () => {
    const obj = { a: 1, b: 2 }
    const result = reduce(
      obj,
      (acc, value, key) => [...acc, `${String(key)}:${value}`],
      [] as string[]
    )

    expect(result).toEqual(['a:1', 'b:2'])
  })
})

