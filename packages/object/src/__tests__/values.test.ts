import { describe, test, expect } from 'vitest'

import values from '../values'

describe('values', () => {
  test('returns all values', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = values(obj)

    expect(result).toEqual([1, 2, 3])
  })

  test('handles empty object', () => {
    const obj = {}
    const result = values(obj)

    expect(result).toEqual([])
  })

  test('handles single property', () => {
    const obj = { key: 'value' }
    const result = values(obj)

    expect(result).toEqual(['value'])
  })

  test('returns array', () => {
    const obj = { a: 1 }
    const result = values(obj)

    expect(Array.isArray(result)).toBe(true)
  })

  test('handles mixed value types', () => {
    const obj = { num: 1, str: 'hello', bool: true }
    const result = values(obj)

    expect(result).toEqual([1, 'hello', true])
  })
})

