import { describe, test, expect } from 'vitest'

import find from '../find'
import { createTestTree } from './helpers'

describe('find', () => {
  test('finds node by condition', () => {
    const tree = createTestTree()
    const result = find(tree, (node) => node.name === 'Child 2')

    expect(result?.id).toBe('child2')
  })

  test('finds root node when condition matches', () => {
    const tree = createTestTree()
    const result = find(tree, (node) => node.name === 'Root')

    expect(result?.id).toBe('root')
  })

  test('finds nested node', () => {
    const tree = createTestTree()
    const result = find(tree, (node) => node.name === 'Grandchild 1')

    expect(result?.id).toBe('grandchild1')
  })

  test('returns null if not found', () => {
    const tree = createTestTree()
    const result = find(tree, (node) => node.name === 'Non-existent')

    expect(result).toBeNull()
  })

  test('returns first matching node', () => {
    const tree = createTestTree()
    const result = find(tree, (node) => node.id.startsWith('child'))

    expect(result?.id).toBe('child1')
  })

  test('works with single node tree', () => {
    const tree = { id: 'single', name: 'Single', children: null }
    const result = find(tree, (node) => node.name === 'Single')

    expect(result?.id).toBe('single')
  })
})

