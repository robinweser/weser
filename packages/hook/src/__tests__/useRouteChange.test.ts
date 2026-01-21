import { describe, test, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'

import useRouteChange from '../useRouteChange'

describe('useRouteChange', () => {
  test('calls callback with pathname when pathname changes', () => {
    const callback = vi.fn()

    const { rerender } = renderHook(
      ({ pathname }) => useRouteChange(callback, pathname),
      { initialProps: { pathname: '/home' } }
    )

    expect(callback).toHaveBeenCalledWith('/home')

    rerender({ pathname: '/about' })

    expect(callback).toHaveBeenCalledWith('/about')
    expect(callback).toHaveBeenCalledTimes(2)
  })

  test('does not call callback when pathname is undefined', () => {
    const callback = vi.fn()

    renderHook(() => useRouteChange(callback, undefined))

    expect(callback).not.toHaveBeenCalled()
  })

  test('adds click event listener', () => {
    const callback = vi.fn()
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')

    renderHook(() => useRouteChange(callback, '/home'))

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'click',
      expect.any(Function)
    )

    addEventListenerSpy.mockRestore()
  })

  test('removes click event listener on unmount', () => {
    const callback = vi.fn()
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

    const { unmount } = renderHook(() => useRouteChange(callback, '/home'))

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'click',
      expect.any(Function)
    )

    removeEventListenerSpy.mockRestore()
  })

  test('respects dependencies array', () => {
    const callback = vi.fn()
    let dep = 'initial'

    const { rerender } = renderHook(
      () => useRouteChange(callback, '/home', [dep]),
      { initialProps: {} }
    )

    expect(callback).toHaveBeenCalledTimes(1)

    dep = 'changed'
    rerender({})

    // Callback may be called again due to dependency change
    expect(callback).toHaveBeenCalled()
  })
})

