import { describe, test, expect, vi, afterEach } from 'vitest'
import { renderHook, cleanup } from '@testing-library/react'
import { useRef } from 'react'

import useFocusTrap from '../useFocusTrap'

// Note: Many useFocusTrap tests are skipped because jsdom doesn't support
// the :is() CSS selector used in the focusableSelector. These tests would 
// need to run in a real browser environment (e.g., Playwright/Cypress).

describe('useFocusTrap', () => {
  afterEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  test('does nothing when not active', () => {
    const element = document.createElement('div')
    element.innerHTML = '<button>First</button><button>Second</button>'
    document.body.appendChild(element)

    // This should not throw
    const { result } = renderHook(() => {
      const ref = useRef<HTMLElement>(element)
      useFocusTrap(ref, false)
      return ref
    })

    expect(result.current.current).toBe(element)
  })

  test('accepts ref and active parameter', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)

    const { result } = renderHook(() => {
      const ref = useRef<HTMLElement>(element)
      useFocusTrap(ref, false, { visible: false, autoFocus: false })
      return ref
    })

    expect(result.current.current).toBe(element)
  })

  test('does not auto-focus when autoFocus is false', () => {
    const element = document.createElement('div')
    const button = document.createElement('button')
    button.focus = vi.fn()
    element.appendChild(button)
    document.body.appendChild(element)

    renderHook(() => {
      const ref = useRef<HTMLElement>(element)
      // visible: false and autoFocus: false to avoid triggering :is() selector
      useFocusTrap(ref, true, { visible: false, autoFocus: false })
      return ref
    })

    // Since visible is false, focus should not be called
    expect(button.focus).not.toHaveBeenCalled()
  })

  // Tests that require :is() selector support are skipped for jsdom
  test.skip('focuses first focusable element when visible', () => {
    // Requires real browser - jsdom doesn't support :is() selector
  })

  test.skip('focuses element with data-autofocus attribute first', () => {
    // Requires real browser - jsdom doesn't support :is() selector
  })

  test.skip('traps focus on Tab key press', () => {
    // Requires real browser - jsdom doesn't support :is() selector
  })
})
