import { describe, test, expect } from 'vitest'

import getAnimationName from '../getAnimationName'

describe('getAnimationName', () => {
  test('generates animation name starting with underscore', () => {
    const style = { from: { opacity: 0 }, to: { opacity: 1 } }
    const result = getAnimationName(style)

    expect(result.startsWith('_')).toBe(true)
  })

  test('generates consistent name for same keyframe', () => {
    const style = { from: { color: 'red' }, to: { color: 'blue' } }
    const name1 = getAnimationName(style)
    const name2 = getAnimationName(style)

    expect(name1).toBe(name2)
  })

  test('generates different names for different keyframes', () => {
    const style1 = { from: { color: 'red' } }
    const style2 = { from: { color: 'blue' } }

    const name1 = getAnimationName(style1)
    const name2 = getAnimationName(style2)

    expect(name1).not.toBe(name2)
  })

  test('handles percentage-based keyframes', () => {
    const style = {
      '0%': { transform: 'scale(1)' },
      '50%': { transform: 'scale(1.5)' },
      '100%': { transform: 'scale(1)' },
    }
    const result = getAnimationName(style)

    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(1)
  })

  test('handles empty keyframe', () => {
    const style = {}
    const result = getAnimationName(style)

    expect(typeof result).toBe('string')
  })
})

