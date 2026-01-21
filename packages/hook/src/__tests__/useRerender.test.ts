import { describe, test, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'

import useRerender from '../useRerender'

describe('useRerender', () => {
  test('returns current Date', () => {
    const { result } = renderHook(() => useRerender())

    expect(result.current).toBeInstanceOf(Date)
  })

  test('calls setInterval with provided interval', () => {
    const setIntervalSpy = vi.spyOn(global, 'setInterval')

    renderHook(() => useRerender(5000))

    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 5000)

    setIntervalSpy.mockRestore()
  })

  test('uses default interval of 60 seconds', () => {
    const setIntervalSpy = vi.spyOn(global, 'setInterval')

    renderHook(() => useRerender())

    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 60000)

    setIntervalSpy.mockRestore()
  })

  test('clears interval on unmount', () => {
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval')

    const { unmount } = renderHook(() => useRerender(1000))

    unmount()

    expect(clearIntervalSpy).toHaveBeenCalled()

    clearIntervalSpy.mockRestore()
  })
})
