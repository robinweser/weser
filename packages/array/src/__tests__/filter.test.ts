import { describe, test, expect } from 'vitest'

import filter from '../filter'

describe('filter', () => {
  test('filters elements by condition', () => {
    const arr = [1, 2, 3, 4, 5]
    const result = filter(arr, (value) => value > 2)

    expect(result).toEqual([3, 4, 5])
  })

  test('returns new array', () => {
    const arr = [1, 2, 3]
    const result = filter(arr, () => true)

    expect(result).not.toBe(arr)
    expect(result).toEqual(arr)
  })

  test('provides correct index to filter function', () => {
    const arr = ['a', 'b', 'c']
    const result = filter(arr, (_, index) => index !== 1)

    expect(result).toEqual(['a', 'c'])
  })

  test('provides correct length to filter function', () => {
    const arr = [1, 2, 3]
    const lengths: number[] = []

    filter(arr, (_, __, length) => {
      lengths.push(length)
      return true
    })

    expect(lengths).toEqual([3, 3, 3])
  })

  test('provides reference to original array', () => {
    const arr = [1, 2, 3]
    let receivedArray: number[] | undefined

    filter(arr, (_, __, ___, array) => {
      receivedArray = array
      return true
    })

    expect(receivedArray).toBe(arr)
  })

  test('handles empty array', () => {
    const arr: number[] = []
    const result = filter(arr, () => true)

    expect(result).toEqual([])
  })

  test('returns empty array when no elements match', () => {
    const arr = [1, 2, 3]
    const result = filter(arr, () => false)

    expect(result).toEqual([])
  })
})

