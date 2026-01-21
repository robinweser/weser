import { describe, test, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'

import useList from '../useList'

describe('useList', () => {
  test('initializes with empty array by default', () => {
    const { result } = renderHook(() => useList<number>())

    expect(result.current[0]).toEqual([])
  })

  test('initializes with provided list', () => {
    const { result } = renderHook(() => useList([1, 2, 3]))

    expect(result.current[0]).toEqual([1, 2, 3])
  })

  test('add appends item to list', () => {
    const { result } = renderHook(() => useList<number>())

    act(() => {
      result.current[1].add(1)
    })

    expect(result.current[0]).toEqual([1])

    act(() => {
      result.current[1].add(2)
    })

    expect(result.current[0]).toEqual([1, 2])
  })

  test('removeAt removes item at index', () => {
    const { result } = renderHook(() => useList([1, 2, 3]))

    act(() => {
      result.current[1].removeAt(1)
    })

    expect(result.current[0]).toEqual([1, 3])
  })

  test('updateAt updates item at index', () => {
    const { result } = renderHook(() => useList([1, 2, 3]))

    act(() => {
      result.current[1].updateAt(1, 10)
    })

    expect(result.current[0]).toEqual([1, 10, 3])
  })

  test('insertAt inserts item at index', () => {
    const { result } = renderHook(() => useList([1, 3]))

    act(() => {
      result.current[1].insertAt(1, 2)
    })

    expect(result.current[0]).toEqual([1, 2, 3])
  })

  test('clear empties the list', () => {
    const { result } = renderHook(() => useList([1, 2, 3]))

    act(() => {
      result.current[1].clear()
    })

    expect(result.current[0]).toEqual([])
  })

  test('set replaces entire list', () => {
    const { result } = renderHook(() => useList([1, 2, 3]))

    act(() => {
      result.current[1].set([4, 5, 6])
    })

    expect(result.current[0]).toEqual([4, 5, 6])
  })
})

