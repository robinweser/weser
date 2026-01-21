import { describe, test, expect, vi } from 'vitest'

import fallbackValuePlugin from '../fallbackValue'

describe('fallbackValuePlugin', () => {
  const createMockContext = () => ({
    createNode: vi.fn(),
    mergeStyle: vi.fn(),
    props: {},
  })

  test('returns style unchanged with no fallbacks', () => {
    const mockContext = createMockContext()
    const plugin = fallbackValuePlugin([])

    const style = { color: 'red', width: 100 }

    const result = plugin(style as any, mockContext as any)

    expect(result.color).toBe('red')
    expect(result.width).toBe(100)
    expect(mockContext.createNode).not.toHaveBeenCalled()
  })

  test('applies fallback when property and value match', () => {
    const mockContext = createMockContext()
    const plugin = fallbackValuePlugin([
      {
        property: ['width'],
        fallback: (value) =>
          value === 'fit-content' ? ['-webkit-fit-content', 'fit-content'] : undefined,
      },
    ])

    const style = { width: 'fit-content' }

    const result = plugin(style as any, mockContext as any)

    expect(result.width).toContain('var(')
    expect(mockContext.createNode).toHaveBeenCalled()
  })

  test('does not apply fallback when value does not match', () => {
    const mockContext = createMockContext()
    const plugin = fallbackValuePlugin([
      {
        property: ['width'],
        fallback: (value) =>
          value === 'fit-content' ? ['fit-content'] : undefined,
      },
    ])

    const style = { width: '100px' }

    const result = plugin(style as any, mockContext as any)

    expect(result.width).toBe('100px')
    expect(mockContext.createNode).not.toHaveBeenCalled()
  })

  test('does not apply fallback when property does not match', () => {
    const mockContext = createMockContext()
    const plugin = fallbackValuePlugin([
      {
        property: ['width'],
        fallback: (value) =>
          value === 'min-content' ? ['-webkit-min-content'] : undefined,
      },
    ])

    const style = { height: 'min-content' }

    const result = plugin(style as any, mockContext as any)

    expect(result.height).toBe('min-content')
    expect(mockContext.createNode).not.toHaveBeenCalled()
  })

  test('handles nested style objects', () => {
    const mockContext = createMockContext()
    const plugin = fallbackValuePlugin([
      {
        property: ['width'],
        fallback: (value) =>
          value === 'max-content' ? ['-webkit-max-content', 'max-content'] : undefined,
      },
    ])

    const style = {
      ':hover': { width: 'max-content' },
    }

    const result = plugin(style as any, mockContext as any)

    expect(result[':hover'].width).toContain('var(')
  })

  test('handles multiple fallback rules', () => {
    const mockContext = createMockContext()
    const plugin = fallbackValuePlugin([
      {
        property: ['width'],
        fallback: (value) =>
          value === 'min-content' ? ['-webkit-min-content'] : undefined,
      },
      {
        property: ['height'],
        fallback: (value) =>
          value === 'max-content' ? ['-webkit-max-content'] : undefined,
      },
    ])

    const style = { width: 'min-content', height: 'max-content' }

    const result = plugin(style as any, mockContext as any)

    expect(result.width).toContain('var(')
    expect(result.height).toContain('var(')
    expect(mockContext.createNode).toHaveBeenCalledTimes(2)
  })
})

