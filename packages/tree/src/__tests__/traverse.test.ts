import { describe, test, expect, vi } from 'vitest'

import traverse from '../traverse'
import { createTestTree, type TestNode } from './helpers'

describe('traverse', () => {
  test('traverses all nodes top-down by default', () => {
    const tree = createTestTree()
    const visited: string[] = []

    traverse(tree, (node) => {
      visited.push(node.id)
    })

    expect(visited).toContain('root')
    expect(visited).toContain('child1')
    expect(visited).toContain('grandchild1')
    expect(visited.length).toBe(6)
  })

  test('traverses in top-down order', () => {
    const tree = createTestTree()
    const visited: string[] = []

    traverse(
      tree,
      (node) => {
        visited.push(node.id)
      },
      'top-down'
    )

    // Root should come before children
    expect(visited.indexOf('root')).toBeLessThan(visited.indexOf('child1'))
    // Parent should come before grandchildren
    expect(visited.indexOf('child1')).toBeLessThan(
      visited.indexOf('grandchild1')
    )
  })

  test('traverses in bottom-up order', () => {
    const tree = createTestTree()
    const visited: string[] = []

    traverse(
      tree,
      (node) => {
        visited.push(node.id)
      },
      'bottom-up'
    )

    // Children should come before root
    expect(visited.indexOf('child1')).toBeLessThan(visited.indexOf('root'))
    // Grandchildren should come before parent
    expect(visited.indexOf('grandchild1')).toBeLessThan(
      visited.indexOf('child1')
    )
  })

  test('calls callback with node', () => {
    const tree = createTestTree()
    const callback = vi.fn()

    traverse(tree, callback)

    expect(callback).toHaveBeenCalled()
    expect(callback.mock.calls[0][0]).toHaveProperty('id')
    expect(callback.mock.calls[0][0]).toHaveProperty('name')
  })

  test('handles single node tree', () => {
    const tree: TestNode = { id: 'single', name: 'Single', children: null }
    const visited: string[] = []

    traverse(tree, (node) => {
      visited.push(node.id)
    })

    expect(visited).toEqual(['single'])
  })
})

