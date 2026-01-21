import { describe, test, expect } from 'vitest'

import find from '../find'

describe('find', () => {
  test('finds first matching key by value', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = find(obj, (value) => value === 2)

    expect(result).toBe('b')
  })

  test('returns undefined when no match', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = find(obj, (value) => value === 99)

    expect(result).toBeUndefined()
  })

  test('handles empty object', () => {
    const obj = {}
    const result = find(obj, () => true)

    expect(result).toBeUndefined()
  })

  test('can find by key', () => {
    const obj = { apple: 1, banana: 2, cherry: 3 }
    const result = find(obj, (_, key) => (key as string).startsWith('b'))

    expect(result).toBe('banana')
  })

  test('provides reference to original object', () => {
    const obj = { a: 1 }
    let receivedObj: typeof obj | undefined

    find(obj, (_, __, o) => {
      receivedObj = o
      return true
    })

    expect(receivedObj).toBe(obj)
  })
})

