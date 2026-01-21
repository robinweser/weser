import React from 'react'
import { describe, test, expect, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'

import LayerProvider from '../LayerProvider'
import useLayer from '../useLayer'

function createWrapper() {
  return ({ children }: { children: React.ReactNode }) => (
    <LayerProvider>{children}</LayerProvider>
  )
}

describe('useLayer', () => {
  test('returns ref, active state, and id', () => {
    const { result } = renderHook(() => useLayer(false), {
      wrapper: createWrapper(),
    })

    const [ref, active, id] = result.current

    expect(ref).toBeDefined()
    expect(typeof active).toBe('boolean')
    expect(typeof id).toBe('string')
  })

  test('layer is not active when not visible', () => {
    const { result } = renderHook(() => useLayer(false), {
      wrapper: createWrapper(),
    })

    expect(result.current[1]).toBe(false)
  })

  test('layer becomes active when visible', async () => {
    const { result, rerender } = renderHook(
      ({ visible }) => useLayer<HTMLDivElement>(visible),
      {
        wrapper: createWrapper(),
        initialProps: { visible: false },
      }
    )

    expect(result.current[1]).toBe(false)

    rerender({ visible: true })

    await waitFor(() => {
      expect(result.current[1]).toBe(true)
    })
  })

  test('generates unique id', () => {
    const { result: result1 } = renderHook(() => useLayer(false), {
      wrapper: createWrapper(),
    })
    const { result: result2 } = renderHook(() => useLayer(false), {
      wrapper: createWrapper(),
    })

    expect(result1.current[2]).not.toBe(result2.current[2])
  })

  test('accepts optional data parameter', () => {
    const data = { title: 'Modal Title', size: 'large' }

    const { result } = renderHook(
      () => useLayer<HTMLDivElement>(true, data),
      {
        wrapper: createWrapper(),
      }
    )

    const [ref, active, id] = result.current

    expect(ref).toBeDefined()
    expect(typeof active).toBe('boolean')
    expect(typeof id).toBe('string')
  })

  test('layer becomes inactive when visibility changes to false', async () => {
    const { result, rerender } = renderHook(
      ({ visible }) => useLayer<HTMLDivElement>(visible),
      {
        wrapper: createWrapper(),
        initialProps: { visible: true },
      }
    )

    await waitFor(() => {
      expect(result.current[1]).toBe(true)
    })

    rerender({ visible: false })

    await waitFor(() => {
      expect(result.current[1]).toBe(false)
    })
  })
})

