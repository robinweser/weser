import { describe, test, expect } from 'vitest'

import remove from '../remove'
import get from '../get'
import { createTestTree } from './helpers'

describe('remove', () => {
  test('removes node from tree', () => {
    const tree = createTestTree()
    const result = remove(tree, 'child2')

    expect(get(result, 'child2')).toBeNull()
  })

  test('preserves other siblings', () => {
    const tree = createTestTree()
    const result = remove(tree, 'child2')

    expect(get(result, 'child1')).not.toBeNull()
    expect(get(result, 'child3')).not.toBeNull()
  })

  test('removes nested node', () => {
    const tree = createTestTree()
    const result = remove(tree, 'grandchild1')

    expect(get(result, 'grandchild1')).toBeNull()
    expect(get(result, 'grandchild2')).not.toBeNull()
  })

  test('removes node with children', () => {
    const tree = createTestTree()
    const result = remove(tree, 'child1')

    expect(get(result, 'child1')).toBeNull()
    expect(get(result, 'grandchild1')).toBeNull()
    expect(get(result, 'grandchild2')).toBeNull()
  })

  test('returns tree unchanged if node not found', () => {
    const tree = createTestTree()
    const result = remove(tree, 'non-existent')

    expect(get(result, 'root')).not.toBeNull()
    expect(get(result, 'child1')).not.toBeNull()
  })

  test('updates parent children count', () => {
    const tree = createTestTree()
    const result = remove(tree, 'child2')

    const parent = get(result, 'root')
    expect(parent?.children).toHaveLength(2)
  })
})

