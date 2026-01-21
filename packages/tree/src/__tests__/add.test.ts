import { describe, test, expect } from 'vitest'

import add from '../add'
import get from '../get'
import { createTestTree, createSimpleNode } from './helpers'

describe('add', () => {
  test('adds child to parent node', () => {
    const tree = createTestTree()
    const newNode = createSimpleNode('new-node', 'New Node')
    const result = add(tree, 'root', newNode)

    const added = get(result, 'new-node')
    expect(added?.name).toBe('New Node')
  })

  test('adds child at end of children array', () => {
    const tree = createTestTree()
    const newNode = createSimpleNode('new-node', 'New Node')
    const result = add(tree, 'root', newNode)

    const parent = get(result, 'root')
    expect(parent?.children?.at(-1)?.id).toBe('new-node')
  })

  test('adds child to nested node', () => {
    const tree = createTestTree()
    const newNode = createSimpleNode('new-grandchild', 'New Grandchild')
    const result = add(tree, 'child1', newNode)

    const parent = get(result, 'child1')
    expect(parent?.children).toHaveLength(3)
    expect(parent?.children?.at(-1)?.id).toBe('new-grandchild')
  })

  test('returns unchanged tree if parent not found', () => {
    const tree = createTestTree()
    const newNode = createSimpleNode('new-node', 'New Node')
    const result = add(tree, 'non-existent', newNode)

    expect(result).toBe(tree)
  })

  test('returns unchanged tree if parent has no children array', () => {
    const tree = createTestTree()
    const newNode = createSimpleNode('new-node', 'New Node')
    const result = add(tree, 'grandchild1', newNode)

    expect(result).toBe(tree)
  })

  test('can add to empty children array', () => {
    const tree = createTestTree()
    const newNode = createSimpleNode('new-node', 'New Node')
    const result = add(tree, 'child2', newNode)

    const parent = get(result, 'child2')
    expect(parent?.children).toHaveLength(1)
  })
})
