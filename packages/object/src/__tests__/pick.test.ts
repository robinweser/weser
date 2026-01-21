import { describe, test, expect } from 'vitest'

import pick from '../pick'

describe('pick', () => {
  test('picks specified keys', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = pick(obj, ['a', 'c'])

    expect(result).toEqual({ a: 1, c: 3 })
  })

  test('picks single key', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = pick(obj, ['b'])

    expect(result).toEqual({ b: 2 })
  })

  test('returns new object', () => {
    const obj = { a: 1 }
    const result = pick(obj, ['a'])

    expect(result).not.toBe(obj)
  })

  test('handles empty keys array', () => {
    const obj = { a: 1, b: 2 }
    const result = pick(obj, [])

    expect(result).toEqual({})
  })

  test('handles empty object', () => {
    const obj = {} as Record<string, number>
    const result = pick(obj, ['a' as never])

    expect(result).toEqual({})
  })

  test('ignores keys not in object', () => {
    const obj = { a: 1, b: 2 }
    const result = pick(obj, ['a', 'c' as 'a' | 'b'])

    expect(result).toEqual({ a: 1 })
  })
})

