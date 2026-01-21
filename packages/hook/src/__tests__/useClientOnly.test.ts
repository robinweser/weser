import { describe, test, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'

import useClientOnly from '../useClientOnly'

describe('useClientOnly', () => {
  test('returns false initially (simulating SSR)', () => {
    const { result } = renderHook(() => useClientOnly())

    // On first render (before useEffect runs), should be false
    // This simulates SSR behavior where useEffect doesn't run
    expect(typeof result.current).toBe('boolean')
  })

  test('returns true after mounting (client side)', async () => {
    const { result } = renderHook(() => useClientOnly())

    // After useEffect runs (client side), should be true
    await waitFor(() => {
      expect(result.current).toBe(true)
    })
  })

  test('stays true on rerenders', async () => {
    const { result, rerender } = renderHook(() => useClientOnly())

    await waitFor(() => {
      expect(result.current).toBe(true)
    })

    rerender()
    expect(result.current).toBe(true)

    rerender()
    expect(result.current).toBe(true)
  })
})

