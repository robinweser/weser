import { describe, test, expect } from 'vitest'

import keys from '../keys'

describe('keys', () => {
  test('returns all keys', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = keys(obj)

    expect(result).toEqual(['a', 'b', 'c'])
  })

  test('handles empty object', () => {
    const obj = {}
    const result = keys(obj)

    expect(result).toEqual([])
  })

  test('handles single property', () => {
    const obj = { key: 'value' }
    const result = keys(obj)

    expect(result).toEqual(['key'])
  })

  test('returns array', () => {
    const obj = { a: 1 }
    const result = keys(obj)

    expect(Array.isArray(result)).toBe(true)
  })
})

