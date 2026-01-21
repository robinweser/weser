import { describe, test, expect, vi, beforeAll, afterAll, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor, act, cleanup } from '@testing-library/react'

import useBreakpoint from '../useBreakpoint'

// Mock matchMedia globally for jsdom
const mockMatchMedia = vi.fn().mockImplementation((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}))

describe('useBreakpoint', () => {
  beforeAll(() => {
    // Set up matchMedia mock before all tests
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    })
  })

  beforeEach(() => {
    vi.useFakeTimers()
    mockMatchMedia.mockClear()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
    cleanup()
  })

  test('returns false initially when breakpoint does not match', async () => {
    mockMatchMedia.mockImplementation((query: string) => ({
      matches: false,
      media: query,
    }))

    const { result } = renderHook(() => useBreakpoint('(min-width: 768px)', 0))

    // Run the debounced timer
    act(() => {
      vi.runAllTimers()
    })

    expect(result.current).toBe(false)
  })

  test('returns true when breakpoint matches', async () => {
    mockMatchMedia.mockImplementation((query: string) => ({
      matches: true,
      media: query,
    }))

    const { result } = renderHook(() => useBreakpoint('(min-width: 768px)', 0))

    act(() => {
      vi.runAllTimers()
    })

    expect(result.current).toBe(true)
  })

  test('adds resize event listener', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')

    renderHook(() => useBreakpoint('(min-width: 768px)'))

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'resize',
      expect.any(Function)
    )

    addEventListenerSpy.mockRestore()
  })

  test('removes resize event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

    const { unmount } = renderHook(() => useBreakpoint('(min-width: 768px)'))

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'resize',
      expect.any(Function)
    )

    removeEventListenerSpy.mockRestore()
  })

  test('uses custom delay', () => {
    const setTimeoutSpy = vi.spyOn(global, 'setTimeout')

    renderHook(() => useBreakpoint('(min-width: 768px)', 500))

    // Initial call happens immediately, subsequent calls are debounced
    expect(setTimeoutSpy).toHaveBeenCalled()

    setTimeoutSpy.mockRestore()
  })
})
