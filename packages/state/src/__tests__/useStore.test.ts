import { describe, test, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

import useStore from '../useStore'

describe('useStore', () => {
  // Actions must return [newState] or [newState, effect] tuple
  const actions = {
    increment: (state: { count: number }) => [{ count: state.count + 1 }],
    decrement: (state: { count: number }) => [{ count: state.count - 1 }],
    add: (state: { count: number }, amount: number) => [
      { count: state.count + amount },
    ],
  }

  test('initializes with initial state', () => {
    const { result } = renderHook(() => useStore(actions, { count: 0 }))

    const [state] = result.current

    expect(state.count).toBe(0)
  })

  test('returns resolved actions', () => {
    const { result } = renderHook(() => useStore(actions, { count: 0 }))

    const [, resolvedActions] = result.current

    expect(resolvedActions.increment).toBeDefined()
    expect(resolvedActions.decrement).toBeDefined()
    expect(resolvedActions.add).toBeDefined()
  })

  test('actions update state', () => {
    const { result } = renderHook(() => useStore(actions, { count: 0 }))

    act(() => {
      result.current[1].increment()
    })

    expect(result.current[0].count).toBe(1)
  })

  test('actions with payload update state correctly', () => {
    const { result } = renderHook(() => useStore(actions, { count: 0 }))

    act(() => {
      result.current[1].add(5)
    })

    expect(result.current[0].count).toBe(5)
  })

  test('multiple action calls work correctly', () => {
    const { result } = renderHook(() => useStore(actions, { count: 0 }))

    act(() => {
      result.current[1].increment()
    })

    act(() => {
      result.current[1].increment()
    })

    act(() => {
      result.current[1].increment()
    })

    expect(result.current[0].count).toBe(3)
  })

  test('decrement action works', () => {
    const { result } = renderHook(() => useStore(actions, { count: 10 }))

    act(() => {
      result.current[1].decrement()
    })

    expect(result.current[0].count).toBe(9)
  })

  test('handles object state updates', () => {
    const objectActions = {
      setName: (state: { name: string; age: number }, name: string) => [
        { ...state, name },
      ],
      setAge: (state: { name: string; age: number }, age: number) => [
        { ...state, age },
      ],
    }

    const { result } = renderHook(() =>
      useStore(objectActions, { name: '', age: 0 })
    )

    act(() => {
      result.current[1].setName('John')
    })

    expect(result.current[0].name).toBe('John')
    expect(result.current[0].age).toBe(0)

    act(() => {
      result.current[1].setAge(30)
    })

    expect(result.current[0].name).toBe('John')
    expect(result.current[0].age).toBe(30)
  })

  // Tests based on docs - effects
  test('actions can return effects as second tuple element', async () => {
    const effectFn = vi.fn()

    const actionsWithEffect = {
      doSomething: (state: { value: number }) =>
        [
          { value: state.value + 1 },
          (actions: any) => {
            effectFn(actions)
          },
        ] as const,
    }

    const { result } = renderHook(() =>
      useStore(actionsWithEffect, { value: 0 })
    )

    act(() => {
      result.current[1].doSomething()
    })

    expect(result.current[0].value).toBe(1)
    expect(effectFn).toHaveBeenCalled()
  })

  test('effects receive actions object', async () => {
    let receivedActions: any = null

    const actionsWithEffect = {
      setData: (state: { data: string | null }, data: string) => [
        { data },
      ],
      fetchData: (state: { data: string | null }) =>
        [
          { data: null },
          (actions: any) => {
            receivedActions = actions
          },
        ] as const,
    }

    const { result } = renderHook(() =>
      useStore(actionsWithEffect, { data: null })
    )

    act(() => {
      result.current[1].fetchData()
    })

    expect(receivedActions).toBeDefined()
    expect(receivedActions.setData).toBeDefined()
    expect(receivedActions.fetchData).toBeDefined()
  })

  test('effect can invoke other actions (async pattern)', async () => {
    // This tests the pattern shown in docs where effect calls other actions
    const setDataCalled = vi.fn()

    const actionsWithEffect = {
      setData: (state: { loading: boolean; data: string | null }, data: string) => {
        setDataCalled(data)
        return [{ loading: false, data }]
      },
      fetchData: (state: { loading: boolean; data: string | null }) =>
        [
          { loading: true, data: null },
          (actions: any) => {
            // Effect receives resolved actions and can call them
            actions.setData('loaded data')
          },
        ] as const,
    }

    const { result } = renderHook(() =>
      useStore(actionsWithEffect, { loading: false, data: null })
    )

    // First, verify loading state is set immediately
    act(() => {
      result.current[1].fetchData()
    })

    // The effect should have called setData
    expect(setDataCalled).toHaveBeenCalledWith('loaded data')
  })
})
