import { describe, test, expect } from 'vitest'

import unique from '../unique'

describe('unique', () => {
  test('removes duplicates from primitives', () => {
    const arr = [1, 2, 2, 3, 3, 3]
    const result = unique(arr)

    expect(result).toEqual([1, 2, 3])
  })

  test('preserves order', () => {
    const arr = [3, 1, 2, 1, 3, 2]
    const result = unique(arr)

    expect(result).toEqual([3, 1, 2])
  })

  test('handles strings', () => {
    const arr = ['a', 'b', 'a', 'c', 'b']
    const result = unique(arr)

    expect(result).toEqual(['a', 'b', 'c'])
  })

  test('handles empty array', () => {
    const arr: number[] = []
    const result = unique(arr)

    expect(result).toEqual([])
  })

  test('returns new array', () => {
    const arr = [1, 2, 3]
    const result = unique(arr)

    expect(result).not.toBe(arr)
  })

  test('handles array with no duplicates', () => {
    const arr = [1, 2, 3, 4, 5]
    const result = unique(arr)

    expect(result).toEqual([1, 2, 3, 4, 5])
  })

  test('handles array with all same values', () => {
    const arr = [1, 1, 1, 1]
    const result = unique(arr)

    expect(result).toEqual([1])
  })

  test('handles mixed types', () => {
    const arr = [1, '1', 2, '2', 1, '1']
    const result = unique(arr)

    expect(result).toEqual([1, '1', 2, '2'])
  })
})

