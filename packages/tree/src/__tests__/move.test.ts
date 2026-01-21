import { describe, test, expect } from 'vitest'

import move from '../move'
import get from '../get'
import getParent from '../getParent'
import { createTestTree } from './helpers'

describe('move', () => {
  test('moves node to new parent', () => {
    const tree = createTestTree()
    const result = move(tree, 'grandchild1', 'child2')

    // Node should be in new parent
    const newParent = get(result, 'child2')
    expect(newParent?.children?.some((c) => c.id === 'grandchild1')).toBe(true)
  })

  test('removes node from old parent', () => {
    const tree = createTestTree()
    const result = move(tree, 'grandchild1', 'child2')

    // Node should not be in old parent
    const oldParent = get(result, 'child1')
    expect(oldParent?.children?.some((c) => c.id === 'grandchild1')).toBe(false)
  })

  test('moves to specific index', () => {
    const tree = createTestTree()
    const result = move(tree, 'child3', 'root', 0)

    const parent = get(result, 'root')
    expect(parent?.children?.[0].id).toBe('child3')
  })

  test('moves to end if no index specified', () => {
    const tree = createTestTree()
    const result = move(tree, 'child1', 'child2')

    const newParent = get(result, 'child2')
    expect(newParent?.children?.at(-1)?.id).toBe('child1')
  })

  test('returns unchanged tree if node not found', () => {
    const tree = createTestTree()
    const result = move(tree, 'non-existent', 'root')

    expect(result).toBe(tree)
  })

  test('returns unchanged tree if parent not found', () => {
    const tree = createTestTree()
    const result = move(tree, 'child1', 'non-existent')

    expect(result).toBe(tree)
  })

  test('returns unchanged tree if parent has no children', () => {
    const tree = createTestTree()
    const result = move(tree, 'child1', 'grandchild1')

    expect(result).toBe(tree)
  })
})

