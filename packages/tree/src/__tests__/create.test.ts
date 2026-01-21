import { describe, test, expect } from 'vitest'

import create from '../create'

describe('create', () => {
  test('creates node with auto-generated id', () => {
    const node = create({ name: 'Test', children: null })

    expect(node.id).toBeDefined()
    expect(typeof node.id).toBe('string')
    expect(node.id.length).toBeGreaterThan(0)
  })

  test('preserves other properties', () => {
    const node = create({ name: 'Test Node', children: null })

    expect(node.name).toBe('Test Node')
    expect(node.children).toBeNull()
  })

  test('generates unique ids', () => {
    const node1 = create({ name: 'Node 1', children: null })
    const node2 = create({ name: 'Node 2', children: null })

    expect(node1.id).not.toBe(node2.id)
  })

  test('handles nodes with children', () => {
    const node = create({
      name: 'Parent',
      children: [{ id: 'child', name: 'Child', children: null }],
    })

    expect(node.children).toHaveLength(1)
    expect(node.children![0].id).toBe('child')
  })
})

