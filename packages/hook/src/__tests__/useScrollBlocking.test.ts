import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'

import useScrollBlocking from '../useScrollBlocking'

describe('useScrollBlocking', () => {
  let originalScrollingElement: Element | null

  beforeEach(() => {
    // Mock scrollingElement
    originalScrollingElement = document.scrollingElement

    Object.defineProperty(document, 'scrollingElement', {
      value: document.createElement('div'),
      writable: true,
      configurable: true,
    })
  })

  afterEach(() => {
    Object.defineProperty(document, 'scrollingElement', {
      value: originalScrollingElement,
      writable: true,
      configurable: true,
    })
  })

  test('blocks scrolling when active is true', () => {
    const { rerender } = renderHook(({ active }) => useScrollBlocking(active), {
      initialProps: { active: false },
    })

    const scrollElement = document.scrollingElement as HTMLElement

    rerender({ active: true })

    expect(scrollElement.style.overflow).toBe('hidden')
    expect(scrollElement.style.position).toBe('fixed')
    expect(scrollElement.style.width).toBe('100%')
  })

  test('enables scrolling when active is false', () => {
    const { rerender } = renderHook(({ active }) => useScrollBlocking(active), {
      initialProps: { active: true },
    })

    const scrollElement = document.scrollingElement as HTMLElement

    // First block
    expect(scrollElement.style.position).toBe('fixed')

    // Then unblock
    rerender({ active: false })

    expect(scrollElement.style.position).toBe('')
    expect(scrollElement.style.overflow).toBe('')
  })

  test('does not modify styles when initially inactive', () => {
    renderHook(() => useScrollBlocking(false))

    const scrollElement = document.scrollingElement as HTMLElement

    expect(scrollElement.style.position).toBe('')
    expect(scrollElement.style.overflow).toBe('')
  })
})

