import { describe, test, expect } from 'vitest'

import get from '../get'
import { createTestTree } from './helpers'

describe('get', () => {
  test('gets root node by id', () => {
    const tree = createTestTree()
    const result = get(tree, 'root')

    expect(result).toBe(tree)
    expect(result?.name).toBe('Root')
  })

  test('gets child node by id', () => {
    const tree = createTestTree()
    const result = get(tree, 'child1')

    expect(result?.id).toBe('child1')
    expect(result?.name).toBe('Child 1')
  })

  test('gets nested node by id', () => {
    const tree = createTestTree()
    const result = get(tree, 'grandchild1')

    expect(result?.id).toBe('grandchild1')
    expect(result?.name).toBe('Grandchild 1')
  })

  test('returns null for non-existent id', () => {
    const tree = createTestTree()
    const result = get(tree, 'non-existent')

    expect(result).toBeNull()
  })

  test('works with tree without children', () => {
    const tree = { id: 'single', name: 'Single', children: null }
    const result = get(tree, 'single')

    expect(result?.id).toBe('single')
  })
})

