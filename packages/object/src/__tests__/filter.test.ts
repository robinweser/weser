import { describe, test, expect } from 'vitest'

import filter from '../filter'

describe('filter', () => {
  test('filters by value condition', () => {
    const obj = { a: 1, b: 2, c: 3, d: 4 }
    const result = filter(obj, (value) => value > 2)

    expect(result).toEqual({ c: 3, d: 4 })
  })

  test('filters by key condition', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = filter(obj, (_, key) => key !== 'b')

    expect(result).toEqual({ a: 1, c: 3 })
  })

  test('returns new object', () => {
    const obj = { a: 1 }
    const result = filter(obj, () => true)

    expect(result).not.toBe(obj)
  })

  test('handles empty object', () => {
    const obj = {}
    const result = filter(obj, () => true)

    expect(result).toEqual({})
  })

  test('returns empty object when no properties match', () => {
    const obj = { a: 1, b: 2 }
    const result = filter(obj, () => false)

    expect(result).toEqual({})
  })

  test('provides reference to original object', () => {
    const obj = { a: 1 }
    let receivedObj: typeof obj | undefined

    filter(obj, (_, __, o) => {
      receivedObj = o
      return true
    })

    expect(receivedObj).toBe(obj)
  })
})

