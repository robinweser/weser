import { describe, test, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'

import useDisclosure from '../useDisclosure'

describe('useDisclosure', () => {
  test('returns isExpanded as false by default', () => {
    const { result } = renderHook(() => useDisclosure())

    expect(result.current.isExpanded).toBe(false)
  })

  test('respects initial expanded state', () => {
    const { result } = renderHook(() => useDisclosure(true))

    expect(result.current.isExpanded).toBe(true)
  })

  test('toggle changes isExpanded state', () => {
    const { result } = renderHook(() => useDisclosure())

    expect(result.current.isExpanded).toBe(false)

    act(() => {
      result.current.toggle()
    })

    expect(result.current.isExpanded).toBe(true)

    act(() => {
      result.current.toggle()
    })

    expect(result.current.isExpanded).toBe(false)
  })

  test('provides toggleProps with aria attributes', () => {
    const { result } = renderHook(() => useDisclosure())

    expect(result.current.toggleProps).toHaveProperty('onClick')
    expect(result.current.toggleProps).toHaveProperty('type', 'button')
    expect(result.current.toggleProps).toHaveProperty('aria-expanded')
    expect(result.current.toggleProps).toHaveProperty('aria-controls')
  })

  test('provides contentProps with aria attributes', () => {
    const { result } = renderHook(() => useDisclosure())

    expect(result.current.contentProps).toHaveProperty('aria-hidden')
    expect(result.current.contentProps).toHaveProperty('aria-labelledby')
  })

  test('aria-expanded reflects isExpanded state', () => {
    const { result } = renderHook(() => useDisclosure(false))

    expect(result.current.toggleProps['aria-expanded']).toBe(false)

    act(() => {
      result.current.toggle()
    })

    expect(result.current.toggleProps['aria-expanded']).toBe(true)
  })
})

