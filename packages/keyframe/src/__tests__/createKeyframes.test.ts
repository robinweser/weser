import { describe, test, expect } from 'vitest'

import createKeyframes from '../createKeyframes'

describe('createKeyframes', () => {
  test('creates multiple keyframes', () => {
    const [animationNames, node] = createKeyframes({
      fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
      fadeOut: { from: { opacity: 1 }, to: { opacity: 0 } },
    })

    expect(animationNames.fadeIn).toBeDefined()
    expect(animationNames.fadeOut).toBeDefined()
    expect(animationNames.fadeIn).not.toBe(animationNames.fadeOut)
  })

  test('returns animation name map', () => {
    const [animationNames] = createKeyframes({
      bounce: { '0%': { transform: 'translateY(0)' } },
    })

    expect(typeof animationNames.bounce).toBe('string')
    expect(animationNames.bounce.startsWith('_')).toBe(true)
  })

  test('returns style node', () => {
    const [, node] = createKeyframes({
      slide: { from: { left: 0 }, to: { left: '100%' } },
    })

    expect(node).toBeDefined()
    expect(node.type).toBe('style')
  })

  test('handles single keyframe', () => {
    const [animationNames, node] = createKeyframes({
      pulse: { '50%': { transform: 'scale(1.1)' } },
    })

    expect(Object.keys(animationNames)).toHaveLength(1)
    expect(animationNames.pulse).toBeDefined()
  })

  test('generates consistent names', () => {
    const [names1] = createKeyframes({
      test: { from: { color: 'red' } },
    })
    const [names2] = createKeyframes({
      test: { from: { color: 'red' } },
    })

    expect(names1.test).toBe(names2.test)
  })

  test('accepts nonce parameter', () => {
    const nonce = 'test-nonce'
    const [, node] = createKeyframes(
      {
        anim: { to: { opacity: 1 } },
      },
      nonce
    )

    expect(node.props.nonce).toBe(nonce)
  })
})

