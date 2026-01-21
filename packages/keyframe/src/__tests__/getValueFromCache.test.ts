import { describe, test, expect } from 'vitest'

import getValueFromCache from '../getValueFromCache'

describe('getValueFromCache', () => {
  test('generates correct keyframe CSS', () => {
    const style = { from: { opacity: 0 }, to: { opacity: 1 } }
    const result = getValueFromCache('testAnimation', style)

    expect(result).toContain('@keyframes testAnimation')
    expect(result).toContain('from')
    expect(result).toContain('to')
    expect(result).toContain('opacity')
  })

  test('returns cached value on subsequent calls', () => {
    const style = { from: { color: 'green' } }
    const animationName = 'cachedAnimation'

    const result1 = getValueFromCache(animationName, style)
    const result2 = getValueFromCache(animationName, style)

    expect(result1).toBe(result2)
  })

  test('handles percentage-based keyframes', () => {
    const style = {
      '0%': { transform: 'translateX(0)' },
      '100%': { transform: 'translateX(100px)' },
    }
    const result = getValueFromCache('percentAnimation', style)

    expect(result).toContain('0%')
    expect(result).toContain('100%')
  })

  test('handles multiple CSS properties', () => {
    const style = {
      from: { opacity: 0, transform: 'scale(0.5)' },
      to: { opacity: 1, transform: 'scale(1)' },
    }
    const result = getValueFromCache('multiPropAnimation', style)

    expect(result).toContain('opacity')
    expect(result).toContain('transform')
  })

  test('properly formats CSS property names', () => {
    const style = {
      from: { backgroundColor: 'red' },
      to: { backgroundColor: 'blue' },
    }
    const result = getValueFromCache('bgAnimation', style)

    // css-in-js-utils converts to kebab-case
    expect(result).toContain('background-color')
  })
})

