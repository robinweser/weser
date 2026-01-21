import { describe, test, expect } from 'vitest'

import update from '../update'
import get from '../get'
import { createTestTree } from './helpers'

describe('update', () => {
  test('updates node properties', () => {
    const tree = createTestTree()
    const result = update(tree, 'child1', { name: 'Updated Child 1' })

    const updated = get(result, 'child1')
    expect(updated?.name).toBe('Updated Child 1')
  })

  test('preserves unchanged properties', () => {
    const tree = createTestTree()
    const result = update(tree, 'child1', { name: 'Updated' })

    const updated = get(result, 'child1')
    expect(updated?.id).toBe('child1')
    expect(updated?.children).toHaveLength(2)
  })

  test('updates nested node', () => {
    const tree = createTestTree()
    const result = update(tree, 'grandchild1', { name: 'Updated Grandchild' })

    const updated = get(result, 'grandchild1')
    expect(updated?.name).toBe('Updated Grandchild')
  })

  test('returns unchanged tree if node not found', () => {
    const tree = createTestTree()
    const result = update(tree, 'non-existent', { name: 'New Name' })

    expect(result).toBe(tree)
  })

  test('can update multiple properties', () => {
    const tree = createTestTree()
    const result = update(tree, 'child1', {
      name: 'Updated',
      children: [],
    })

    const updated = get(result, 'child1')
    expect(updated?.name).toBe('Updated')
    expect(updated?.children).toEqual([])
  })
})

