import { describe, test, expect } from 'vitest'

import getParent from '../getParent'
import { createTestTree } from './helpers'

describe('getParent', () => {
  test('gets parent of child node', () => {
    const tree = createTestTree()
    const result = getParent(tree, 'child1')

    expect(result?.id).toBe('root')
  })

  test('gets parent of nested node', () => {
    const tree = createTestTree()
    const result = getParent(tree, 'grandchild1')

    expect(result?.id).toBe('child1')
  })

  test('returns null for root node', () => {
    const tree = createTestTree()
    const result = getParent(tree, 'root')

    expect(result).toBeNull()
  })

  test('returns null for non-existent node', () => {
    const tree = createTestTree()
    const result = getParent(tree, 'non-existent')

    expect(result).toBeNull()
  })

  test('works with different depth levels', () => {
    const tree = createTestTree()
    const parent1 = getParent(tree, 'grandchild2')
    const parent2 = getParent(tree, 'child2')

    expect(parent1?.id).toBe('child1')
    expect(parent2?.id).toBe('root')
  })
})

