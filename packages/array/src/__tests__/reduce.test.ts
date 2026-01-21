import { describe, test, expect } from 'vitest'

import reduce from '../reduce'

describe('reduce', () => {
  test('reduces with accumulator', () => {
    const arr = [1, 2, 3, 4]
    const result = reduce(arr, (acc, value) => acc + value, 0)

    expect(result).toBe(10)
  })

  test('uses initial value', () => {
    const arr = [1, 2, 3]
    const result = reduce(arr, (acc, value) => acc + value, 10)

    expect(result).toBe(16)
  })

  test('provides correct index to reducer', () => {
    const arr = ['a', 'b', 'c']
    const indices: number[] = []

    reduce(
      arr,
      (acc, _, index) => {
        indices.push(index)
        return acc
      },
      null
    )

    expect(indices).toEqual([0, 1, 2])
  })

  test('provides correct length to reducer', () => {
    const arr = [1, 2, 3]
    const lengths: number[] = []

    reduce(
      arr,
      (acc, _, __, length) => {
        lengths.push(length)
        return acc
      },
      null
    )

    expect(lengths).toEqual([3, 3, 3])
  })

  test('provides reference to original array', () => {
    const arr = [1, 2, 3]
    let receivedArray: number[] | undefined

    reduce(
      arr,
      (acc, _, __, ___, array) => {
        receivedArray = array
        return acc
      },
      null
    )

    expect(receivedArray).toBe(arr)
  })

  test('handles empty array', () => {
    const arr: number[] = []
    const result = reduce(arr, (acc, value) => acc + value, 0)

    expect(result).toBe(0)
  })

  test('can reduce to different type', () => {
    const arr = [1, 2, 3]
    const result = reduce(
      arr,
      (acc, value) => {
        acc[`key${value}`] = value
        return acc
      },
      {} as Record<string, number>
    )

    expect(result).toEqual({ key1: 1, key2: 2, key3: 3 })
  })
})

