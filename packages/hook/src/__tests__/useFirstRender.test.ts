import { describe, test, expect } from 'vitest'
import { renderHook } from '@testing-library/react'

import useFirstRender from '../useFirstRender'

describe('useFirstRender', () => {
  test('returns true on first render', () => {
    const { result } = renderHook(() => useFirstRender())

    expect(result.current).toBe(true)
  })

  test('returns false after rerender', () => {
    const { result, rerender } = renderHook(() => useFirstRender())

    expect(result.current).toBe(true)

    rerender()

    expect(result.current).toBe(false)
  })

  test('stays false on subsequent rerenders', () => {
    const { result, rerender } = renderHook(() => useFirstRender())

    rerender()
    expect(result.current).toBe(false)

    rerender()
    expect(result.current).toBe(false)

    rerender()
    expect(result.current).toBe(false)
  })
})

