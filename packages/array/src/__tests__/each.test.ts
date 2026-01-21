import { describe, test, expect, vi } from 'vitest'

import each from '../each'

describe('each', () => {
  test('iterates all elements', () => {
    const arr = [1, 2, 3]
    const callback = vi.fn()

    each(arr, callback)

    expect(callback).toHaveBeenCalledTimes(3)
  })

  test('provides correct value to iterator', () => {
    const arr = ['a', 'b', 'c']
    const values: string[] = []

    each(arr, (value) => {
      values.push(value)
    })

    expect(values).toEqual(['a', 'b', 'c'])
  })

  test('provides correct index to iterator', () => {
    const arr = ['a', 'b', 'c']
    const indices: number[] = []

    each(arr, (_, index) => {
      indices.push(index)
    })

    expect(indices).toEqual([0, 1, 2])
  })

  test('provides correct length to iterator', () => {
    const arr = [1, 2, 3, 4, 5]
    const lengths: number[] = []

    each(arr, (_, __, length) => {
      lengths.push(length)
    })

    expect(lengths).toEqual([5, 5, 5, 5, 5])
  })

  test('provides reference to original array', () => {
    const arr = [1, 2, 3]
    let receivedArray: number[] | undefined

    each(arr, (_, __, ___, array) => {
      receivedArray = array
    })

    expect(receivedArray).toBe(arr)
  })

  test('handles empty array', () => {
    const arr: number[] = []
    const callback = vi.fn()

    each(arr, callback)

    expect(callback).not.toHaveBeenCalled()
  })
})

