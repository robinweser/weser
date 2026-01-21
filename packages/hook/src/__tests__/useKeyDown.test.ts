import { describe, test, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

import useKeyDown from '../useKeyDown'

describe('useKeyDown', () => {
  test('calls callback when key is pressed', () => {
    const callback = vi.fn()

    renderHook(() => useKeyDown('Enter', callback))

    act(() => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', { code: 'Enter', bubbles: true })
      )
    })

    expect(callback).toHaveBeenCalled()
  })

  test('does not call callback for different key', () => {
    const callback = vi.fn()

    renderHook(() => useKeyDown('Enter', callback))

    act(() => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', { code: 'Escape', bubbles: true })
      )
    })

    expect(callback).not.toHaveBeenCalled()
  })

  test('accepts array of key codes', () => {
    const callback = vi.fn()

    renderHook(() => useKeyDown(['Enter', 'Space'], callback))

    act(() => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', { code: 'Space', bubbles: true })
      )
    })

    expect(callback).toHaveBeenCalled()
  })

  test('does not call callback when active is false', () => {
    const callback = vi.fn()

    renderHook(() => useKeyDown('Enter', callback, { active: false }))

    act(() => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', { code: 'Enter', bubbles: true })
      )
    })

    expect(callback).not.toHaveBeenCalled()
  })

  test('respects ctrl modifier', () => {
    const callback = vi.fn()

    renderHook(() =>
      useKeyDown('KeyS', callback, { modifiers: { ctrl: true } })
    )

    // Without ctrl
    act(() => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', { code: 'KeyS', bubbles: true })
      )
    })

    expect(callback).not.toHaveBeenCalled()

    // With ctrl
    act(() => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', {
          code: 'KeyS',
          ctrlKey: true,
          bubbles: true,
        })
      )
    })

    expect(callback).toHaveBeenCalled()
  })

  test('respects meta modifier', () => {
    const callback = vi.fn()

    renderHook(() =>
      useKeyDown('KeyS', callback, { modifiers: { meta: true } })
    )

    act(() => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', {
          code: 'KeyS',
          metaKey: true,
          bubbles: true,
        })
      )
    })

    expect(callback).toHaveBeenCalled()
  })

  test('respects alt modifier', () => {
    const callback = vi.fn()

    renderHook(() => useKeyDown('KeyA', callback, { modifiers: { alt: true } }))

    act(() => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', {
          code: 'KeyA',
          altKey: true,
          bubbles: true,
        })
      )
    })

    expect(callback).toHaveBeenCalled()
  })

  test('respects shift modifier', () => {
    const callback = vi.fn()

    renderHook(() =>
      useKeyDown('KeyA', callback, { modifiers: { shift: true } })
    )

    act(() => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', {
          code: 'KeyA',
          shiftKey: true,
          bubbles: true,
        })
      )
    })

    expect(callback).toHaveBeenCalled()
  })

  test('removes event listener on unmount', () => {
    const callback = vi.fn()
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')

    const { unmount } = renderHook(() => useKeyDown('Enter', callback))

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function)
    )

    removeEventListenerSpy.mockRestore()
  })
})

