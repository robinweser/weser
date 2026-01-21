import { describe, test, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'

import useTree from '../useTree'

type TestNode = {
  id: string
  name: string
  children: TestNode[] | null
}

describe('useTree', () => {
  const initialTree: TestNode = {
    id: 'root',
    name: 'Root',
    children: [
      { id: 'child1', name: 'Child 1', children: [] },
      {
        id: 'child2',
        name: 'Child 2',
        children: [{ id: 'grandchild', name: 'Grandchild', children: [] }],
      },
    ],
  }

  test('initializes with provided tree', () => {
    const { result } = renderHook(() => useTree(initialTree))

    expect(result.current.tree).toEqual(initialTree)
  })

  test('get retrieves node by id', () => {
    const { result } = renderHook(() => useTree(initialTree))

    const node = result.current.get('child1')

    expect(node).toEqual({ id: 'child1', name: 'Child 1', children: [] })
  })

  test('get returns null for non-existent id', () => {
    const { result } = renderHook(() => useTree(initialTree))

    const node = result.current.get('nonexistent')

    expect(node).toBeNull()
  })

  test('find finds node by condition', () => {
    const { result } = renderHook(() => useTree(initialTree))

    const node = result.current.find((n) => n.name === 'Grandchild')

    expect(node?.id).toBe('grandchild')
  })

  test('findAll finds all matching nodes', () => {
    const { result } = renderHook(() => useTree(initialTree))

    const nodes = result.current.findAll((n) => n.name.startsWith('Child'))

    expect(nodes).toHaveLength(2)
  })

  test('getParent returns parent node', () => {
    const { result } = renderHook(() => useTree(initialTree))

    const parent = result.current.getParent('grandchild')

    expect(parent?.id).toBe('child2')
  })

  test('update modifies a node', () => {
    const { result } = renderHook(() => useTree(initialTree))

    act(() => {
      result.current.update('child1', { name: 'Updated Child' })
    })

    const updatedNode = result.current.get('child1')
    expect(updatedNode?.name).toBe('Updated Child')
  })

  test('remove removes a node', () => {
    const { result } = renderHook(() => useTree(initialTree))

    act(() => {
      result.current.remove('child1')
    })

    const removedNode = result.current.get('child1')
    expect(removedNode).toBeNull()
  })

  test('add adds a child node', () => {
    const { result } = renderHook(() => useTree(initialTree))

    const newNode: TestNode = {
      id: 'newchild',
      name: 'New Child',
      children: [],
    }

    act(() => {
      result.current.add('root', newNode)
    })

    const addedNode = result.current.get('newchild')
    expect(addedNode).toEqual(newNode)
  })

  test('create creates a new node with unique id', () => {
    const { result } = renderHook(() => useTree(initialTree))

    const newNode = result.current.create({
      name: 'Created Node',
      children: [],
    })

    expect(newNode.id).toBeDefined()
    expect(newNode.name).toBe('Created Node')
  })

  test('traverse visits all nodes', () => {
    const { result } = renderHook(() => useTree(initialTree))

    const visited: string[] = []
    result.current.traverse((node) => {
      visited.push(node.id)
    })

    expect(visited).toContain('root')
    expect(visited).toContain('child1')
    expect(visited).toContain('child2')
    expect(visited).toContain('grandchild')
  })

  test('setTree replaces the entire tree', () => {
    const { result } = renderHook(() => useTree(initialTree))

    const newTree: TestNode = { id: 'new-root', name: 'New Root', children: [] }

    act(() => {
      result.current.setTree(newTree)
    })

    expect(result.current.tree).toEqual(newTree)
  })
})
