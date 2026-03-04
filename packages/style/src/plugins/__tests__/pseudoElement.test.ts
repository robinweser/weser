import { describe, test, expect, vi } from 'vitest'

import pseudoElementPlugin from '../pseudoElement'

describe('pseudoElementPlugin', () => {
  const createMockContext = () => ({
    createNode: vi.fn(),
    mergeStyle: vi.fn(),
    props: {} as Record<string, any>,
  })

  test('extracts pseudo element styles and creates node', () => {
    const mockContext = createMockContext()
    const plugin = pseudoElementPlugin()

    const style = {
      color: 'red',
      '::before': {
        content: '""',
        display: 'block',
      },
    }

    const result = plugin(style as any, mockContext as any)

    // Pseudo element should be removed from style
    expect(result['::before']).toBeUndefined()
    expect(result.color).toBe('red')

    // Node should be created
    expect(mockContext.createNode).toHaveBeenCalled()

    // data-style-id should be set
    expect(mockContext.props['data-style-id']).toBeDefined()
  })

  test('handles ::after pseudo element', () => {
    const mockContext = createMockContext()
    const plugin = pseudoElementPlugin()

    const style = {
      '::after': {
        content: '"→"',
        marginLeft: 8,
      },
    }

    const result = plugin(style as any, mockContext as any)

    expect(result['::after']).toBeUndefined()
    expect(mockContext.createNode).toHaveBeenCalled()
  })

  test('preserves non-pseudo-element nested styles', () => {
    const mockContext = createMockContext()
    const plugin = pseudoElementPlugin()

    const style = {
      ':hover': {
        color: 'blue',
      },
    }

    const result = plugin(style as any, mockContext as any)

    expect(result[':hover']).toEqual({ color: 'blue' })
    expect(mockContext.createNode).not.toHaveBeenCalled()
  })

  test('handles nested pseudo elements', () => {
    const mockContext = createMockContext()
    const plugin = pseudoElementPlugin()

    const style = {
      ':hover': {
        '::before': {
          opacity: 1,
        },
      },
    }

    const result = plugin(style as any, mockContext as any)

    // The ::before inside :hover should be processed
    expect(result[':hover']?.['::before']).toBeUndefined()
    expect(mockContext.createNode).toHaveBeenCalled()
  })

  test('handles multiple pseudo elements', () => {
    const mockContext = createMockContext()
    const plugin = pseudoElementPlugin()

    const style = {
      '::before': { content: '"←"' },
      '::after': { content: '"→"' },
    }

    const result = plugin(style as any, mockContext as any)

    expect(result['::before']).toBeUndefined()
    expect(result['::after']).toBeUndefined()
    expect(mockContext.createNode).toHaveBeenCalledTimes(2)
  })

  test('passes through primitive values', () => {
    const mockContext = createMockContext()
    const plugin = pseudoElementPlugin()

    const style = {
      fontSize: 16,
      lineHeight: 1.5,
    }

    const result = plugin(style as any, mockContext as any)

    expect(result.fontSize).toBe(16)
    expect(result.lineHeight).toBe(1.5)
  })
})

