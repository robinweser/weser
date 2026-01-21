import { describe, test, expect, vi, beforeEach } from 'vitest'

import persistence from '../middleware/persistence'

function createMockStorage(): Storage {
  const store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      for (const key in store) {
        delete store[key]
      }
    },
    key: (index: number) => Object.keys(store)[index] ?? null,
    get length() {
      return Object.keys(store).length
    },
  }
}

describe('persistence middleware', () => {
  let mockStorage: Storage

  beforeEach(() => {
    mockStorage = createMockStorage()
  })

  test('returns middleware and effect functions', () => {
    const { middleware, effect } = persistence({
      key: 'test',
      getStorage: () => mockStorage,
    })

    expect(middleware).toBeDefined()
    expect(typeof middleware).toBe('function')
    expect(effect).toBeDefined()
    expect(typeof effect).toBe('function')
  })

  test('middleware persists state to storage', () => {
    const { middleware } = persistence({
      key: 'test-key',
      getStorage: () => mockStorage,
    })

    middleware({ count: 5 }, {
      action: 'increment',
      payload: [],
      prevState: { count: 4 },
    })

    expect(mockStorage.getItem('test-key')).toBe(JSON.stringify({ count: 5 }))
  })

  test('middleware returns nextState unchanged', () => {
    const { middleware } = persistence({
      key: 'test',
      getStorage: () => mockStorage,
    })

    const nextState = { value: 'test' }
    const result = middleware(nextState, {
      action: 'setValue',
      payload: [],
      prevState: {},
    })

    expect(result).toBe(nextState)
  })

  test('middleware respects actions filter', () => {
    const { middleware } = persistence({
      key: 'filtered-key',
      getStorage: () => mockStorage,
      actions: ['save'],
    })

    // Should NOT persist
    middleware({ count: 1 }, {
      action: 'increment',
      payload: [],
      prevState: {},
    })

    expect(mockStorage.getItem('filtered-key')).toBeNull()

    // Should persist
    middleware({ count: 2 }, {
      action: 'save',
      payload: [],
      prevState: {},
    })

    expect(mockStorage.getItem('filtered-key')).toBe(JSON.stringify({ count: 2 }))
  })

  test('uses custom encode function', () => {
    const { middleware } = persistence({
      key: 'custom-encode',
      getStorage: () => mockStorage,
      encode: (data) => `ENCODED:${JSON.stringify(data)}`,
    })

    middleware({ test: true }, {
      action: 'test',
      payload: [],
      prevState: {},
    })

    expect(mockStorage.getItem('custom-encode')).toBe('ENCODED:{"test":true}')
  })

  test('effect hydrates state from storage', async () => {
    mockStorage.setItem('hydrate-key', JSON.stringify({ restored: true }))

    const setState = vi.fn()
    const { effect } = persistence({
      key: 'hydrate-key',
      getStorage: () => mockStorage,
    })

    effect!(setState)

    // Wait for async hydration
    await new Promise((resolve) => setTimeout(resolve, 10))

    expect(setState).toHaveBeenCalledWith({ restored: true })
  })

  test('effect calls onHydrated callback', async () => {
    mockStorage.setItem('callback-key', JSON.stringify({ data: 'test' }))

    const onHydrated = vi.fn()
    const { effect } = persistence({
      key: 'callback-key',
      getStorage: () => mockStorage,
      onHydrated,
    })

    effect!(vi.fn())

    await new Promise((resolve) => setTimeout(resolve, 10))

    expect(onHydrated).toHaveBeenCalledWith({ data: 'test' })
  })
})
