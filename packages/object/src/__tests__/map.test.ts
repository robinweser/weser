import { describe, test, expect } from 'vitest'

import map from '../map'

describe('map', () => {
  test('transforms values', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = map(obj, (value) => value * 2)

    expect(result).toEqual({ a: 2, b: 4, c: 6 })
  })

  test('returns new object', () => {
    const obj = { a: 1 }
    const result = map(obj, (value) => value)

    expect(result).not.toBe(obj)
  })

  test('handles empty object', () => {
    const obj = {}
    const result = map(obj, (value) => value)

    expect(result).toEqual({})
  })

  test('provides key to mapper', () => {
    const obj = { a: 1, b: 2 }
    const result = map(obj, (value, key) => `${key}-${value}`)

    expect(result).toEqual({ a: 'a-1', b: 'b-2' })
  })

  test('provides reference to original object', () => {
    const obj = { a: 1 }
    let receivedObj: typeof obj | undefined

    map(obj, (_, __, o) => {
      receivedObj = o
      return null
    })

    expect(receivedObj).toBe(obj)
  })

  test('can transform to different types', () => {
    const obj = { a: 1, b: 2 }
    const result = map(obj, (value) => String(value))

    expect(result).toEqual({ a: '1', b: '2' })
  })
})

