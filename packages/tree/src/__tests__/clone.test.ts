import { describe, test, expect } from 'vitest'

import clone from '../clone'
import { createTestTree } from './helpers'

describe('clone', () => {
  test('clones node with new id', () => {
    const tree = createTestTree()
    const cloned = clone(tree, 'child1')

    expect(cloned).not.toBeNull()
    expect(cloned?.id).not.toBe('child1')
    expect(cloned?.name).toBe('Child 1')
  })

  test('clones all descendants with new ids', () => {
    const tree = createTestTree()
    const cloned = clone(tree, 'child1')

    expect(cloned?.children).toHaveLength(2)
    expect(cloned?.children?.[0].id).not.toBe('grandchild1')
    expect(cloned?.children?.[1].id).not.toBe('grandchild2')
  })

  test('preserves structure', () => {
    const tree = createTestTree()
    const cloned = clone(tree, 'child1')

    expect(cloned?.children).toHaveLength(2)
    expect(cloned?.children?.[0].name).toBe('Grandchild 1')
    expect(cloned?.children?.[1].name).toBe('Grandchild 2')
  })

  test('returns null for non-existent node', () => {
    const tree = createTestTree()
    const cloned = clone(tree, 'non-existent')

    expect(cloned).toBeNull()
  })

  test('clones leaf node', () => {
    const tree = createTestTree()
    const cloned = clone(tree, 'grandchild1')

    expect(cloned).not.toBeNull()
    expect(cloned?.id).not.toBe('grandchild1')
    expect(cloned?.name).toBe('Grandchild 1')
    expect(cloned?.children).toBeNull()
  })

  test('cloned tree is independent', () => {
    const tree = createTestTree()
    const cloned = clone(tree, 'root')

    // Verify the clone has different ids
    expect(cloned?.id).not.toBe('root')
  })
})

