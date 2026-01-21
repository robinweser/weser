import { describe, test, expect } from 'vitest'

import mergeDeep from '../mergeDeep'

describe('mergeDeep', () => {
  test('merges flat objects', () => {
    const base = { a: 1, b: 2 }
    const obj = { c: 3 }
    const result = mergeDeep(base, obj)

    expect(result).toEqual({ a: 1, b: 2, c: 3 })
  })

  test('deep merges nested objects', () => {
    const base = { nested: { a: 1 } }
    const obj = { nested: { b: 2 } }
    const result = mergeDeep(base, obj)

    expect(result).toEqual({ nested: { a: 1, b: 2 } })
  })

  test('overwrites primitive values', () => {
    const base = { a: 1 }
    const obj = { a: 2 }
    const result = mergeDeep(base, obj)

    expect(result).toEqual({ a: 2 })
  })

  test('handles multiple objects', () => {
    const base = { a: 1 }
    const obj1 = { b: 2 }
    const obj2 = { c: 3 }
    const result = mergeDeep(base, obj1, obj2)

    expect(result).toEqual({ a: 1, b: 2, c: 3 })
  })

  test('returns mutated base object', () => {
    const base = { a: 1 }
    const obj = { b: 2 }
    const result = mergeDeep(base, obj)

    expect(result).toBe(base)
  })

  test('handles null values', () => {
    const base = { a: { b: 1 } }
    const obj = { a: null }
    const result = mergeDeep(base, obj as any)

    expect(result).toEqual({ a: null })
  })

  test('handles arrays by overwriting', () => {
    const base = { arr: [1, 2] }
    const obj = { arr: [3, 4, 5] }
    const result = mergeDeep(base, obj)

    expect(result).toEqual({ arr: [3, 4, 5] })
  })

  test('skips __proto__ key for security', () => {
    const base = { a: 1 }
    const malicious = JSON.parse('{"__proto__": {"polluted": true}}')
    mergeDeep(base, malicious)

    expect(({} as any).polluted).toBeUndefined()
  })

  test('skips constructor key for security', () => {
    const base = { a: 1 }
    const obj = { constructor: 'malicious' }
    const result = mergeDeep(base, obj as any)

    expect(result.a).toBe(1)
  })

  test('skips prototype key for security', () => {
    const base = { a: 1 }
    const obj = { prototype: 'malicious' }
    const result = mergeDeep(base, obj as any)

    expect(result.a).toBe(1)
  })

  test('handles deeply nested objects', () => {
    const base = { level1: { level2: { level3: { a: 1 } } } }
    const obj = { level1: { level2: { level3: { b: 2 } } } }
    const result = mergeDeep(base, obj)

    expect(result).toEqual({ level1: { level2: { level3: { a: 1, b: 2 } } } })
  })
})
