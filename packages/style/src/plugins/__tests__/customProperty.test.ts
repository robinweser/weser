import { describe, test, expect, vi } from 'vitest'

import customPropertyPlugin from '../customProperty'

describe('customPropertyPlugin', () => {
  const mockContext = {
    mergeStyle: (target: any, source: any) => Object.assign(target, source),
    createNode: vi.fn(),
    props: {},
  }

  test('resolves custom properties to style objects', () => {
    const plugin = customPropertyPlugin({
      size: (value: number) => ({ width: value, height: value }),
    })

    const result = plugin({ size: 100 } as any, mockContext as any)

    expect(result.width).toBe(100)
    expect(result.height).toBe(100)
  })

  test('removes original property if not in resolved style', () => {
    const plugin = customPropertyPlugin({
      spacing: (value: number) => ({ padding: value, margin: value }),
    })

    const result = plugin({ spacing: 10 } as any, mockContext as any)

    expect(result.spacing).toBeUndefined()
    expect(result.padding).toBe(10)
    expect(result.margin).toBe(10)
  })

  test('preserves original property if in resolved style', () => {
    const plugin = customPropertyPlugin({
      padding: (value: number) => ({ padding: value * 2 }),
    })

    const result = plugin({ padding: 10 } as any, mockContext as any)

    expect(result.padding).toBe(20)
  })

  test('handles nested style objects', () => {
    const plugin = customPropertyPlugin({
      size: (value: number) => ({ width: value, height: value }),
    })

    const result = plugin(
      {
        ':hover': { size: 50 },
      } as any,
      mockContext as any
    )

    expect(result[':hover'].width).toBe(50)
    expect(result[':hover'].height).toBe(50)
  })

  test('passes through non-custom properties', () => {
    const plugin = customPropertyPlugin({
      size: (value: number) => ({ width: value }),
    })

    const result = plugin(
      { size: 100, color: 'red' } as any,
      mockContext as any
    )

    expect(result.color).toBe('red')
    expect(result.width).toBe(100)
  })

  test('handles multiple custom properties', () => {
    const plugin = customPropertyPlugin({
      size: (value: number) => ({ width: value, height: value }),
      spacing: (value: number) => ({ padding: value }),
    })

    const result = plugin({ size: 100, spacing: 10 } as any, mockContext as any)

    expect(result.width).toBe(100)
    expect(result.height).toBe(100)
    expect(result.padding).toBe(10)
  })
})

