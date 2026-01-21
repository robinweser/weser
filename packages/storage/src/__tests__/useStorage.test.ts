import { describe, test, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'

import useStorage from '../useStorage'

// Create a mock storage that mimics the Storage interface
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

describe('useStorage', () => {
  let mockStorage: Storage

  beforeEach(() => {
    mockStorage = createMockStorage()
  })

  test('initializes with initial state', async () => {
    const { result } = renderHook(() =>
      useStorage(() => mockStorage, 'test-key', 'initial')
    )

    // Initial state before hydration
    expect(result.current[0]).toBe('initial')
  })

  test('returns loading state initially true', async () => {
    const { result } = renderHook(() =>
      useStorage(() => mockStorage, 'test-key', 'initial')
    )

    // Loading is true initially
    expect(result.current[2]).toBe(true)

    // Wait for loading to become false
    await waitFor(() => {
      expect(result.current[2]).toBe(false)
    })
  })

  test('setState updates the state', async () => {
    const { result } = renderHook(() =>
      useStorage(() => mockStorage, 'test-key', 'initial')
    )

    await waitFor(() => {
      expect(result.current[2]).toBe(false)
    })

    act(() => {
      result.current[1]('updated')
    })

    expect(result.current[0]).toBe('updated')
  })

  test('persists state to storage', async () => {
    const { result } = renderHook(() =>
      useStorage(() => mockStorage, 'persist-key', 'initial')
    )

    await waitFor(() => {
      expect(result.current[2]).toBe(false)
    })

    act(() => {
      result.current[1]('persisted-value')
    })

    // Check that the value was persisted
    expect(mockStorage.getItem('persist-key')).toBe(
      JSON.stringify('persisted-value')
    )
  })

  test('hydrates from storage', async () => {
    // Pre-populate storage
    mockStorage.setItem('hydrate-key', JSON.stringify('stored-value'))

    const { result } = renderHook(() =>
      useStorage(() => mockStorage, 'hydrate-key', 'initial')
    )

    await waitFor(() => {
      expect(result.current[2]).toBe(false)
    })

    expect(result.current[0]).toBe('stored-value')
  })

  test('calls onHydrated callback', async () => {
    const onHydrated = vi.fn()
    mockStorage.setItem('callback-key', JSON.stringify('value'))

    renderHook(() =>
      useStorage(() => mockStorage, 'callback-key', 'initial', { onHydrated })
    )

    await waitFor(() => {
      expect(onHydrated).toHaveBeenCalledWith('value')
    })
  })

  test('uses custom encode/decode functions', async () => {
    const encode = (value: number) => String(value * 2)
    const decode = (value: string) => parseInt(value) / 2

    mockStorage.setItem('custom-key', '20')

    const { result } = renderHook(() =>
      useStorage(() => mockStorage, 'custom-key', 5, { encode, decode })
    )

    await waitFor(() => {
      expect(result.current[2]).toBe(false)
    })

    expect(result.current[0]).toBe(10)

    act(() => {
      result.current[1](15)
    })

    expect(mockStorage.getItem('custom-key')).toBe('30')
  })

  test('handles null storage gracefully', async () => {
    const { result } = renderHook(() =>
      useStorage(() => null as any, 'test-key', 'initial')
    )

    await waitFor(() => {
      expect(result.current[2]).toBe(false)
    })

    expect(result.current[0]).toBe('initial')
  })

  // Tests based on docs examples for T_SyntheticStorage
  describe('T_SyntheticStorage pattern (from docs)', () => {
    test('works with custom cache implementation (docs example)', async () => {
      // Simulating the docs example with a custom cache
      const cache = new Map<string, any>()

      const getStorage = () => ({
        getItem: (key: string) => cache.get(key),
        setItem: (key: string, value: any) => cache.set(key, value),
      })

      const { result } = renderHook(() => useStorage(getStorage, 'counter', 0))

      await waitFor(() => {
        expect(result.current[2]).toBe(false)
      })

      expect(result.current[0]).toBe(0)

      act(() => {
        result.current[1](5)
      })

      expect(result.current[0]).toBe(5)
      // Value should be persisted to the cache
      expect(cache.get('counter')).toBe(JSON.stringify(5))
    })

    test('works with async synthetic storage', async () => {
      const store = new Map<string, any>()

      const asyncStorage = {
        getItem: async (key: string) => {
          await new Promise((r) => setTimeout(r, 10))
          return store.get(key)
        },
        setItem: async (key: string, value: any) => {
          await new Promise((r) => setTimeout(r, 10))
          store.set(key, value)
        },
      }

      store.set('async-key', JSON.stringify({ data: 'async-value' }))

      const { result } = renderHook(() =>
        useStorage(() => asyncStorage, 'async-key', { data: 'default' })
      )

      // Initially loading
      expect(result.current[2]).toBe(true)

      await waitFor(() => {
        expect(result.current[2]).toBe(false)
      })

      // Should have hydrated from async storage
      expect(result.current[0]).toEqual({ data: 'async-value' })
    })

    test('increment/decrement counter example from docs', async () => {
      const cache = new Map<string, any>()
      cache.set('counter', JSON.stringify(10))

      const getStorage = () => ({
        getItem: (key: string) => cache.get(key),
        setItem: (key: string, value: any) => cache.set(key, value),
      })

      const { result } = renderHook(() => useStorage(getStorage, 'counter', 0))

      await waitFor(() => {
        expect(result.current[2]).toBe(false)
      })

      // Should hydrate to 10
      expect(result.current[0]).toBe(10)

      // Increment
      act(() => {
        result.current[1](result.current[0] + 1)
      })
      expect(result.current[0]).toBe(11)

      // Decrement
      act(() => {
        result.current[1](result.current[0] - 1)
      })
      expect(result.current[0]).toBe(10)
    })

    test('works with typed objects (docs generic type example)', async () => {
      type Account = {
        id: string
        name: string
        email: string
      }

      const cache = new Map<string, any>()
      cache.set(
        'account',
        JSON.stringify({ id: '123', name: 'John', email: 'john@example.com' })
      )

      const getStorage = () => ({
        getItem: (key: string) => cache.get(key),
        setItem: (key: string, value: any) => cache.set(key, value),
      })

      const { result } = renderHook(() =>
        useStorage<Account | null>(getStorage, 'account', null)
      )

      await waitFor(() => {
        expect(result.current[2]).toBe(false)
      })

      expect(result.current[0]).toEqual({
        id: '123',
        name: 'John',
        email: 'john@example.com',
      })

      // Update account
      act(() => {
        result.current[1]({
          id: '456',
          name: 'Jane',
          email: 'jane@example.com',
        })
      })

      expect(result.current[0]).toEqual({
        id: '456',
        name: 'Jane',
        email: 'jane@example.com',
      })
    })
  })
})
