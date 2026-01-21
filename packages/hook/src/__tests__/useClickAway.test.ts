import { describe, test, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useRef } from 'react'

import useClickAway from '../useClickAway'

describe('useClickAway', () => {
  test('calls callback when clicking outside the element', async () => {
    const callback = vi.fn()

    // Create a mock element
    const element = document.createElement('div')
    document.body.appendChild(element)

    const { result } = renderHook(() => {
      const ref = useRef<HTMLElement>(element)
      useClickAway(ref, callback)
      return ref
    })

    // Click outside the element
    await act(async () => {
      document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
      // Wait for the setTimeout in the hook
      await new Promise((r) => setTimeout(r, 10))
    })

    expect(callback).toHaveBeenCalled()

    document.body.removeChild(element)
  })

  test('does not call callback when clicking inside the element', async () => {
    const callback = vi.fn()

    const element = document.createElement('div')
    document.body.appendChild(element)

    renderHook(() => {
      const ref = useRef<HTMLElement>(element)
      useClickAway(ref, callback)
      return ref
    })

    // Click inside the element
    await act(async () => {
      element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
      await new Promise((r) => setTimeout(r, 10))
    })

    expect(callback).not.toHaveBeenCalled()

    document.body.removeChild(element)
  })

  test('does not call callback when active is false', async () => {
    const callback = vi.fn()

    const element = document.createElement('div')
    document.body.appendChild(element)

    renderHook(() => {
      const ref = useRef<HTMLElement>(element)
      useClickAway(ref, callback, false)
      return ref
    })

    await act(async () => {
      document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
      await new Promise((r) => setTimeout(r, 10))
    })

    expect(callback).not.toHaveBeenCalled()

    document.body.removeChild(element)
  })

  test('listens to touchstart events', async () => {
    const callback = vi.fn()

    const element = document.createElement('div')
    document.body.appendChild(element)

    renderHook(() => {
      const ref = useRef<HTMLElement>(element)
      useClickAway(ref, callback)
      return ref
    })

    await act(async () => {
      document.dispatchEvent(new TouchEvent('touchstart', { bubbles: true }))
      await new Promise((r) => setTimeout(r, 10))
    })

    expect(callback).toHaveBeenCalled()

    document.body.removeChild(element)
  })

  test('removes event listeners on unmount', () => {
    const callback = vi.fn()
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')

    const element = document.createElement('div')
    document.body.appendChild(element)

    const { unmount } = renderHook(() => {
      const ref = useRef<HTMLElement>(element)
      useClickAway(ref, callback)
      return ref
    })

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'mousedown',
      expect.any(Function)
    )
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'touchstart',
      expect.any(Function)
    )

    removeEventListenerSpy.mockRestore()
    document.body.removeChild(element)
  })
})

