import { describe, test, expect } from 'vitest'

import omit from '../omit'

describe('omit', () => {
  test('omits specified keys', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = omit(obj, ['b'])

    expect(result).toEqual({ a: 1, c: 3 })
  })

  test('omits multiple keys', () => {
    const obj = { a: 1, b: 2, c: 3, d: 4 }
    const result = omit(obj, ['a', 'c'])

    expect(result).toEqual({ b: 2, d: 4 })
  })

  test('returns new object', () => {
    const obj = { a: 1 }
    const result = omit(obj, [])

    expect(result).not.toBe(obj)
  })

  test('handles empty keys array', () => {
    const obj = { a: 1, b: 2 }
    const result = omit(obj, [])

    expect(result).toEqual({ a: 1, b: 2 })
  })

  test('handles empty object', () => {
    const obj = {} as Record<string, number>
    const result = omit(obj, ['a' as never])

    expect(result).toEqual({})
  })

  test('ignores keys not in object', () => {
    const obj = { a: 1, b: 2 }
    const result = omit(obj, ['c' as 'a' | 'b'])

    expect(result).toEqual({ a: 1, b: 2 })
  })
})

