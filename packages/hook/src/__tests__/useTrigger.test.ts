import { describe, test, expect, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'

import useTrigger from '../useTrigger'

describe('useTrigger', () => {
  test('returns initial visibility as false by default', () => {
    const { result } = renderHook(() => useTrigger())

    const [isVisible] = result.current

    expect(isVisible).toBe(false)
  })

  test('respects defaultVisible option', async () => {
    const { result } = renderHook(() => useTrigger({ defaultVisible: true }))

    await waitFor(() => {
      expect(result.current[0]).toBe(true)
    })
  })

  test('setVisible changes visibility', () => {
    const { result } = renderHook(() => useTrigger())

    act(() => {
      result.current[1](true)
    })

    expect(result.current[0]).toBe(true)

    act(() => {
      result.current[1](false)
    })

    expect(result.current[0]).toBe(false)
  })

  test('returns a ref object', () => {
    const { result } = renderHook(() => useTrigger())

    const [, , triggerRef] = result.current

    expect(triggerRef).toBeDefined()
    expect(triggerRef).toHaveProperty('current')
  })

  test('focuses trigger element when closing', () => {
    const { result } = renderHook(() => useTrigger())

    // Create a button element to use as trigger
    const button = document.createElement('button')
    button.focus = vi.fn()
    document.body.appendChild(button)

    // Manually set the ref
    ;(result.current[2] as any).current = button

    act(() => {
      result.current[1](true)
    })

    act(() => {
      result.current[1](false)
    })

    expect(button.focus).toHaveBeenCalledWith({ preventScroll: true })

    document.body.removeChild(button)
  })

  test('does not change visibility when setting same value', () => {
    const { result, rerender } = renderHook(() => useTrigger())

    const initialRef = result.current

    act(() => {
      result.current[1](false) // Same as initial
    })

    // The visibility should still be false
    expect(result.current[0]).toBe(false)
  })

  test('uses custom getTrigger function', () => {
    const customButton = document.createElement('button')
    customButton.focus = vi.fn()
    document.body.appendChild(customButton)

    const getTrigger = () => customButton

    const { result } = renderHook(() => useTrigger({ getTrigger }))

    act(() => {
      result.current[1](true)
    })

    act(() => {
      result.current[1](false)
    })

    expect(customButton.focus).toHaveBeenCalled()

    document.body.removeChild(customButton)
  })
})

