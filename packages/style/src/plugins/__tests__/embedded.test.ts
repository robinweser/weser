import { describe, test, expect, vi } from 'vitest'

import embeddedPlugin from '../embedded'

describe('embeddedPlugin', () => {
  const createMockContext = () => ({
    createNode: vi.fn(),
    mergeStyle: vi.fn(),
    props: {},
  })

  test('converts animationName object to keyframe reference', () => {
    const mockContext = createMockContext()
    const plugin = embeddedPlugin()

    const style = {
      animationName: {
        from: { opacity: 0 },
        to: { opacity: 1 },
      },
    }

    const result = plugin(style as any, mockContext as any)

    // animationName should be replaced with a string reference
    expect(typeof result.animationName).toBe('string')
    expect(mockContext.createNode).toHaveBeenCalled()
  })

  test('passes through non-animationName object properties', () => {
    const mockContext = createMockContext()
    const plugin = embeddedPlugin()

    const style = {
      color: 'red',
      fontSize: 16,
    }

    const result = plugin(style as any, mockContext as any)

    expect(result.color).toBe('red')
    expect(result.fontSize).toBe(16)
    expect(mockContext.createNode).not.toHaveBeenCalled()
  })

  test('handles nested style objects', () => {
    const mockContext = createMockContext()
    const plugin = embeddedPlugin()

    const style = {
      ':hover': {
        animationName: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.1)' },
        },
      },
    }

    const result = plugin(style as any, mockContext as any)

    expect(typeof result[':hover']?.animationName).toBe('string')
    expect(mockContext.createNode).toHaveBeenCalled()
  })

  test('preserves other properties in style with animationName', () => {
    const mockContext = createMockContext()
    const plugin = embeddedPlugin()

    const style = {
      animationName: {
        from: { opacity: 0 },
        to: { opacity: 1 },
      },
      animationDuration: '1s',
      animationTimingFunction: 'ease-in-out',
    }

    const result = plugin(style as any, mockContext as any)

    expect(result.animationDuration).toBe('1s')
    expect(result.animationTimingFunction).toBe('ease-in-out')
  })

  test('handles string animationName (already resolved)', () => {
    const mockContext = createMockContext()
    const plugin = embeddedPlugin()

    const style = {
      animationName: 'existingAnimation',
    }

    const result = plugin(style as any, mockContext as any)

    expect(result.animationName).toBe('existingAnimation')
    expect(mockContext.createNode).not.toHaveBeenCalled()
  })
})
