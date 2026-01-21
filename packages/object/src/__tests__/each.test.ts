import { describe, test, expect, vi } from 'vitest'

import each from '../each'

describe('each', () => {
  test('iterates all properties', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const callback = vi.fn()

    each(obj, callback)

    expect(callback).toHaveBeenCalledTimes(3)
  })

  test('provides correct value to iterator', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const values: number[] = []

    each(obj, (value) => {
      values.push(value)
    })

    expect(values).toEqual([1, 2, 3])
  })

  test('provides correct key to iterator', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const keys: string[] = []

    each(obj, (_, key) => {
      keys.push(key as string)
    })

    expect(keys).toEqual(['a', 'b', 'c'])
  })

  test('provides reference to original object', () => {
    const obj = { a: 1 }
    let receivedObj: typeof obj | undefined

    each(obj, (_, __, o) => {
      receivedObj = o
    })

    expect(receivedObj).toBe(obj)
  })

  test('handles empty object', () => {
    const obj = {}
    const callback = vi.fn()

    each(obj, callback)

    expect(callback).not.toHaveBeenCalled()
  })
})

