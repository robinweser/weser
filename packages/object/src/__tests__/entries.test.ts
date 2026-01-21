import { describe, test, expect } from 'vitest'

import entries from '../entries'

describe('entries', () => {
  test('returns key-value pairs', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = entries(obj)

    expect(result).toEqual([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ])
  })

  test('handles empty object', () => {
    const obj = {}
    const result = entries(obj)

    expect(result).toEqual([])
  })

  test('handles single property', () => {
    const obj = { key: 'value' }
    const result = entries(obj)

    expect(result).toEqual([['key', 'value']])
  })

  test('handles mixed value types', () => {
    const obj = { num: 1, str: 'hello', bool: true }
    const result = entries(obj)

    expect(result).toEqual([
      ['num', 1],
      ['str', 'hello'],
      ['bool', true],
    ])
  })
})

