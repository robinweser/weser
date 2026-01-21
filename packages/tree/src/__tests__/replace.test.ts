import { describe, test, expect } from 'vitest'

import replace from '../replace'
import get from '../get'
import { createTestTree, createSimpleNode } from './helpers'

describe('replace', () => {
  test('replaces node with new node', () => {
    const tree = createTestTree()
    const newNode = createSimpleNode('child2', 'Replaced Child 2')
    const result = replace(tree, 'child2', newNode)

    const replaced = get(result, 'child2')
    expect(replaced?.name).toBe('Replaced Child 2')
  })

  test('replaces nested node', () => {
    const tree = createTestTree()
    const newNode = createSimpleNode('grandchild1', 'New Grandchild')
    const result = replace(tree, 'grandchild1', newNode)

    const replaced = get(result, 'grandchild1')
    expect(replaced?.name).toBe('New Grandchild')
  })

  test('can replace with node with different id', () => {
    const tree = createTestTree()
    const newNode = createSimpleNode('new-id', 'New Node')
    const result = replace(tree, 'child2', newNode)

    expect(get(result, 'child2')).toBeNull()
    expect(get(result, 'new-id')?.name).toBe('New Node')
  })

  test('returns unchanged tree if node not found', () => {
    const tree = createTestTree()
    const newNode = createSimpleNode('new-node', 'New Node')
    const result = replace(tree, 'non-existent', newNode)

    expect(result).toBe(tree)
  })

  test('can replace root node', () => {
    const tree = createTestTree()
    const newRoot = createSimpleNode('new-root', 'New Root')
    const result = replace(tree, 'root', newRoot)

    expect(result.id).toBe('new-root')
    expect(result.name).toBe('New Root')
  })

  test('preserves sibling nodes', () => {
    const tree = createTestTree()
    const newNode = createSimpleNode('child2', 'New Child 2')
    const result = replace(tree, 'child2', newNode)

    expect(get(result, 'child1')).not.toBeNull()
    expect(get(result, 'child3')).not.toBeNull()
  })
})

