import { describe, test, expect } from 'vitest'

import responsiveValuePlugin from '../responsiveValue'

describe('responsiveValuePlugin', () => {
  const mediaQueries = [
    '@media (min-width: 480px)',
    '@media (min-width: 768px)',
    '@media (min-width: 1024px)',
  ]

  test('expands array values to media queries', () => {
    const plugin = responsiveValuePlugin(mediaQueries)
    const result = plugin({ fontSize: [16, 18, 20, 24] })

    expect(result.fontSize).toBe(16)
    expect(result['@media (min-width: 480px)']).toEqual({ fontSize: 18 })
    expect(result['@media (min-width: 768px)']).toEqual({ fontSize: 20 })
    expect(result['@media (min-width: 1024px)']).toEqual({ fontSize: 24 })
  })

  test('first value is default', () => {
    const plugin = responsiveValuePlugin(mediaQueries)
    const result = plugin({ padding: [8, 16] })

    expect(result.padding).toBe(8)
    expect(result['@media (min-width: 480px)']).toEqual({ padding: 16 })
  })

  test('handles null/undefined values in array', () => {
    const plugin = responsiveValuePlugin(mediaQueries)
    const result = plugin({ margin: [8, undefined, 16] as any })

    expect(result.margin).toBe(8)
    expect(result['@media (min-width: 480px)']).toBeUndefined()
    expect(result['@media (min-width: 768px)']).toEqual({ margin: 16 })
  })

  test('does not modify non-array values', () => {
    const plugin = responsiveValuePlugin(mediaQueries)
    const result = plugin({ color: 'red', padding: 8 })

    expect(result.color).toBe('red')
    expect(result.padding).toBe(8)
  })

  test('handles nested objects', () => {
    const plugin = responsiveValuePlugin(mediaQueries)
    const result = plugin({
      ':hover': { fontSize: [14, 16] },
    } as any)

    expect(result[':hover'].fontSize).toBe(14)
    expect(result[':hover']['@media (min-width: 480px)']).toEqual({
      fontSize: 16,
    })
  })

  test('handles multiple responsive properties', () => {
    const plugin = responsiveValuePlugin(mediaQueries)
    const result = plugin({
      fontSize: [16, 18],
      padding: [8, 12],
    })

    expect(result.fontSize).toBe(16)
    expect(result.padding).toBe(8)
    expect(result['@media (min-width: 480px)']).toEqual({
      fontSize: 18,
      padding: 12,
    })
  })

  test('limits to number of media queries', () => {
    const plugin = responsiveValuePlugin(['@media (min-width: 480px)'])
    const result = plugin({ fontSize: [16, 18, 20, 24] })

    // Only first media query value used
    expect(result.fontSize).toBe(16)
    expect(result['@media (min-width: 480px)']).toEqual({ fontSize: 18 })
    expect(result['@media (min-width: 768px)']).toBeUndefined()
  })
})

