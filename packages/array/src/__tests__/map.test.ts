import { describe, test, expect } from 'vitest'

import map from '../map'

describe('map', () => {
  test('transforms elements', () => {
    const arr = [1, 2, 3]
    const result = map(arr, (value) => value * 2)

    expect(result).toEqual([2, 4, 6])
  })

  test('returns new array', () => {
    const arr = [1, 2, 3]
    const result = map(arr, (value) => value)

    expect(result).not.toBe(arr)
    expect(result).toEqual(arr)
  })

  test('provides correct index to mapper', () => {
    const arr = ['a', 'b', 'c']
    const result = map(arr, (value, index) => `${value}-${index}`)

    expect(result).toEqual(['a-0', 'b-1', 'c-2'])
  })

  test('provides correct length to mapper', () => {
    const arr = [1, 2, 3]
    const lengths: number[] = []

    map(arr, (_, __, length) => {
      lengths.push(length)
      return null
    })

    expect(lengths).toEqual([3, 3, 3])
  })

  test('provides reference to original array', () => {
    const arr = [1, 2, 3]
    let receivedArray: number[] | undefined

    map(arr, (_, __, ___, array) => {
      receivedArray = array
      return null
    })

    expect(receivedArray).toBe(arr)
  })

  test('handles empty array', () => {
    const arr: number[] = []
    const result = map(arr, (value) => value * 2)

    expect(result).toEqual([])
  })

  test('can transform to different types', () => {
    const arr = [1, 2, 3]
    const result = map(arr, (value) => String(value))

    expect(result).toEqual(['1', '2', '3'])
  })
})

