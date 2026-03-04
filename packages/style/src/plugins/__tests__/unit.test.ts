import { describe, test, expect } from 'vitest'

import unitPlugin from '../unit'

describe('unitPlugin', () => {
  test('adds px units to numeric values', () => {
    const plugin = unitPlugin()
    const result = plugin({ fontSize: 16, padding: 8 })

    expect(result.fontSize).toBe('16px')
    expect(result.padding).toBe('8px')
  })

  test('uses custom default unit', () => {
    const plugin = unitPlugin('rem')
    const result = plugin({ fontSize: 1.5, margin: 2 })

    expect(result.fontSize).toBe('1.5rem')
    expect(result.margin).toBe('2rem')
  })

  test('uses property map for specific properties', () => {
    const plugin = unitPlugin('px', { width: '%' })
    const result = plugin({ fontSize: 16, width: 50 } as any)

    expect(result.fontSize).toBe('16px')
    expect(result.width).toBe('50%')
  })

  test('does not add units to zero values', () => {
    const plugin = unitPlugin()
    const result = plugin({ margin: 0, padding: 0 })

    expect(result.margin).toBe(0)
    expect(result.padding).toBe(0)
  })

  test('does not add units to string values that are not numeric', () => {
    const plugin = unitPlugin()
    const result = plugin({ color: 'red', display: 'flex' })

    expect(result.color).toBe('red')
    expect(result.display).toBe('flex')
  })

  test('adds units to string values that are numeric', () => {
    const plugin = unitPlugin()
    const result = plugin({ fontSize: '16' as any })

    expect(result.fontSize).toBe('16px')
  })

  test('does not add units to unitless properties', () => {
    const plugin = unitPlugin()
    const result = plugin({ zIndex: 10, opacity: 0.5 })

    expect(result.zIndex).toBe(10)
    expect(result.opacity).toBe(0.5)
  })

  test('handles nested objects', () => {
    const plugin = unitPlugin()
    const result = plugin({
      fontSize: 16,
      ':hover': { padding: 8 },
    } as any)

    expect(result.fontSize).toBe('16px')
    expect(result[':hover']?.padding).toBe('8px')
  })

  test('handles array values', () => {
    const plugin = unitPlugin()
    const result = plugin({ padding: [8, 16, 8, 16] } as any)

    expect(result.padding).toEqual(['8px', '16px', '8px', '16px'])
  })

  test('uses custom isUnitlessProperty function', () => {
    const plugin = unitPlugin('px', {}, (prop) => prop === 'padding')
    const result = plugin({ padding: 10, margin: 20 } as any)

    expect(result.padding).toBe(10)
    expect(result.margin).toBe('20px')
  })
})
