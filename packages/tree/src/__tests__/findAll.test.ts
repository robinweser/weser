import { describe, test, expect } from 'vitest'

import findAll from '../findAll'
import { createTestTree } from './helpers'

describe('findAll', () => {
  test('finds all matching nodes', () => {
    const tree = createTestTree()
    const result = findAll(tree, (node) => node.id.startsWith('child'))

    expect(result).toHaveLength(3)
    expect(result.map((n) => n.id)).toEqual(['child1', 'child2', 'child3'])
  })

  test('includes root node if matches', () => {
    const tree = createTestTree()
    const result = findAll(tree, (node) => node.name.includes('Root'))

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('root')
  })

  test('finds nested nodes', () => {
    const tree = createTestTree()
    const result = findAll(tree, (node) => node.id.startsWith('grandchild'))

    expect(result).toHaveLength(2)
  })

  test('returns empty array if none match', () => {
    const tree = createTestTree()
    const result = findAll(tree, (node) => node.name === 'Non-existent')

    expect(result).toEqual([])
  })

  test('finds all nodes with empty children', () => {
    const tree = createTestTree()
    const result = findAll(
      tree,
      (node) => node.children === null || node.children?.length === 0
    )

    // grandchild1, grandchild2, child2 (empty array), child3 (null)
    expect(result).toHaveLength(4)
  })
})

