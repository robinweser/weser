import React from 'react'
import { describe, test, expect, vi } from 'vitest'
import { render, screen, renderHook } from '@testing-library/react'

import createContext from '../createContext'

describe('createContext', () => {
  test('returns tuple of useContext and Provider', () => {
    const [useContext, Provider] = createContext<{ value: string }>(null)

    expect(typeof useContext).toBe('function')
    expect(typeof Provider).toBe('function')
  })

  test('Provider provides value to children', () => {
    const [useContext, Provider] = createContext<{ message: string }>(null)

    function Consumer() {
      const context = useContext()
      return <div data-testid="message">{context.message}</div>
    }

    render(
      <Provider value={{ message: 'Hello World' }}>
        <Consumer />
      </Provider>
    )

    expect(screen.getByTestId('message').textContent).toBe('Hello World')
  })

  test('useContext throws when used without Provider', () => {
    const [useContext] = createContext<{ value: string }>(null)

    // Suppress console.error for expected error
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      renderHook(() => useContext())
    }).toThrow()

    consoleSpy.mockRestore()
  })

  test('error message includes context name when provided', () => {
    const [useContext] = createContext<{ value: string }>(null, 'MyContext')

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      renderHook(() => useContext())
    }).toThrow('Trying to use MyContext context without a provider.')

    consoleSpy.mockRestore()
  })

  test('error message works without context name', () => {
    const [useContext] = createContext<{ value: string }>(null)

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      renderHook(() => useContext())
    }).toThrow('Trying to use context without a provider.')

    consoleSpy.mockRestore()
  })

  test('nested Providers use closest Provider value', () => {
    const [useContext, Provider] = createContext<{ level: number }>(null)

    function Consumer() {
      const context = useContext()
      return <div data-testid="level">{context.level}</div>
    }

    render(
      <Provider value={{ level: 1 }}>
        <Provider value={{ level: 2 }}>
          <Consumer />
        </Provider>
      </Provider>
    )

    expect(screen.getByTestId('level').textContent).toBe('2')
  })

  test('Provider renders children correctly', () => {
    const [, Provider] = createContext<{ value: string }>(null)

    render(
      <Provider value={{ value: 'test' }}>
        <div data-testid="child">Child Content</div>
      </Provider>
    )

    expect(screen.getByTestId('child')).toBeDefined()
    expect(screen.getByTestId('child').textContent).toBe('Child Content')
  })

  test('context value can be any type', () => {
    const [useContext, Provider] = createContext<number>(null)

    function Consumer() {
      const value = useContext()
      return <div data-testid="value">{value}</div>
    }

    render(
      <Provider value={42}>
        <Consumer />
      </Provider>
    )

    expect(screen.getByTestId('value').textContent).toBe('42')
  })
})

