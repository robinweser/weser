import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'

import useStoreWithMiddleware from '../useStoreWithMiddleware'
import logger from '../middleware/logger'
import persistence from '../middleware/persistence'

describe('useStoreWithMiddleware', () => {
  // Test actions that return [newState] tuple format
  const actions = {
    increment: (state: { count: number }) => [{ count: state.count + 1 }],
    decrement: (state: { count: number }) => [{ count: state.count - 1 }],
    set: (state: { count: number }, value: number) => [{ count: value }],
  }

  describe('basic usage', () => {
    test('creates a useStore hook with middleware', () => {
      const useStore = useStoreWithMiddleware([])

      const { result } = renderHook(() => useStore(actions, { count: 0 }))

      expect(result.current[0].count).toBe(0)
    })

    test('actions work correctly', () => {
      const useStore = useStoreWithMiddleware([])

      const { result } = renderHook(() => useStore(actions, { count: 5 }))

      act(() => {
        result.current[1].increment()
      })

      expect(result.current[0].count).toBe(6)
    })
  })

  describe('with logger middleware (docs example)', () => {
    const originalConsole = console.log

    beforeEach(() => {
      console.log = vi.fn()
    })

    afterEach(() => {
      console.log = originalConsole
    })

    test('logs actions with default prefix', () => {
      // Docs example: useStoreWithMiddleware([logger()])
      const useStore = useStoreWithMiddleware([logger()])

      const { result } = renderHook(() => useStore(actions, { count: 0 }))

      act(() => {
        result.current[1].increment()
      })

      expect(console.log).toHaveBeenCalledWith(
        'ALVERON:increment',
        expect.objectContaining({
          prevState: { count: 0 },
          nextState: { count: 1 },
        })
      )
    })

    test('logs actions with custom prefix (docs example)', () => {
      // Docs example: logger({ prefix: 'MY_APP: ' })
      const useStore = useStoreWithMiddleware([logger({ prefix: 'MY_APP: ' })])

      const { result } = renderHook(() => useStore(actions, { count: 0 }))

      act(() => {
        result.current[1].set(42)
      })

      expect(console.log).toHaveBeenCalledWith(
        'MY_APP: set',
        expect.any(Object)
      )
    })
  })

  describe('with persistence middleware (docs example)', () => {
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

    test('persists state to storage (docs example)', async () => {
      const mockStorage = createMockStorage()

      // Docs example: persistence({ key: 'my-app-state', getStorage: () => localStorage })
      const useStore = useStoreWithMiddleware([
        persistence({
          key: 'my-app-state',
          getStorage: () => mockStorage,
        }),
      ])

      const { result } = renderHook(() => useStore(actions, { count: 0 }))

      act(() => {
        result.current[1].increment()
      })

      expect(mockStorage.getItem('my-app-state')).toBe(
        JSON.stringify({ count: 1 })
      )
    })

    test('hydrates from storage on mount', async () => {
      const mockStorage = createMockStorage()
      mockStorage.setItem('hydrate-test', JSON.stringify({ count: 100 }))

      const useStore = useStoreWithMiddleware([
        persistence({
          key: 'hydrate-test',
          getStorage: () => mockStorage,
        }),
      ])

      const { result } = renderHook(() => useStore(actions, { count: 0 }))

      await waitFor(() => {
        expect(result.current[0].count).toBe(100)
      })
    })
  })

  describe('with multiple middleware', () => {
    const originalConsole = console.log

    beforeEach(() => {
      console.log = vi.fn()
    })

    afterEach(() => {
      console.log = originalConsole
    })

    test('combines logger and persistence middleware', async () => {
      const mockStorage: Record<string, string> = {}
      const storage = {
        getItem: (key: string) => mockStorage[key] ?? null,
        setItem: (key: string, value: string) => {
          mockStorage[key] = value
        },
        removeItem: () => {},
        clear: () => {},
        key: () => null,
        length: 0,
      }

      const useStore = useStoreWithMiddleware([
        logger({ prefix: 'LOG: ' }),
        persistence({
          key: 'combined-test',
          getStorage: () => storage,
        }),
      ])

      const { result } = renderHook(() => useStore(actions, { count: 0 }))

      act(() => {
        result.current[1].increment()
      })

      // Logger should have been called
      expect(console.log).toHaveBeenCalled()

      // Persistence should have saved
      expect(mockStorage['combined-test']).toBe(JSON.stringify({ count: 1 }))
    })
  })
})

