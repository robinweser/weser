import { describe, test, expect } from 'vitest'

import insert from '../insert'
import get from '../get'
import { createTestTree, createSimpleNode } from './helpers'

describe('insert', () => {
  test('inserts at specific position', () => {
    const tree = createTestTree()
    const newNode = createSimpleNode('new-node', 'New Node')
    const result = insert(tree, 'root', 1, newNode)

    const parent = get(result, 'root')
    expect(parent?.children?.[1].id).toBe('new-node')
  })

  test('inserts at beginning', () => {
    const tree = createTestTree()
    const newNode = createSimpleNode('first', 'First')
    const result = insert(tree, 'root', 0, newNode)

    const parent = get(result, 'root')
    expect(parent?.children?.[0].id).toBe('first')
  })

  test('inserts at end', () => {
    const tree = createTestTree()
    const newNode = createSimpleNode('last', 'Last')
    const result = insert(tree, 'root', 3, newNode)

    const parent = get(result, 'root')
    expect(parent?.children?.at(-1)?.id).toBe('last')
  })

  test('preserves existing children order', () => {
    const tree = createTestTree()
    const newNode = createSimpleNode('new-node', 'New Node')
    const result = insert(tree, 'root', 1, newNode)

    const parent = get(result, 'root')
    expect(parent?.children?.[0].id).toBe('child1')
    expect(parent?.children?.[1].id).toBe('new-node')
    expect(parent?.children?.[2].id).toBe('child2')
  })

  test('returns unchanged tree if parent not found', () => {
    const tree = createTestTree()
    const newNode = createSimpleNode('new-node', 'New Node')
    const result = insert(tree, 'non-existent', 0, newNode)

    expect(result).toBe(tree)
  })

  test('returns unchanged tree if parent has no children', () => {
    const tree = createTestTree()
    const newNode = createSimpleNode('new-node', 'New Node')
    const result = insert(tree, 'grandchild1', 0, newNode)

    expect(result).toBe(tree)
  })
})

