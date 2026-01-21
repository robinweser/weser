// Shared test helpers and fixtures for tree tests

export type TestNode = {
  id: string
  name: string
  children: TestNode[] | null
}

export function createTestTree(): TestNode {
  return {
    id: 'root',
    name: 'Root',
    children: [
      {
        id: 'child1',
        name: 'Child 1',
        children: [
          { id: 'grandchild1', name: 'Grandchild 1', children: null },
          { id: 'grandchild2', name: 'Grandchild 2', children: null },
        ],
      },
      {
        id: 'child2',
        name: 'Child 2',
        children: [],
      },
      {
        id: 'child3',
        name: 'Child 3',
        children: null,
      },
    ],
  }
}

export function createSimpleNode(id: string, name: string): TestNode {
  return { id, name, children: null }
}

export function createParentNode(
  id: string,
  name: string,
  children: TestNode[]
): TestNode {
  return { id, name, children }
}
