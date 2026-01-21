import { describe, test, expect, vi } from 'vitest'

import debugPlugin from '../debug'

// Mock the styles-debugger module
vi.mock('styles-debugger', () => ({
  CreateStylesDebugger: vi.fn(() => () => ({
    outline: '1px solid red',
    backgroundColor: 'rgba(255,0,0,0.1)',
  })),
}))

describe('debugPlugin', () => {
  test('adds debug styles when autoActive is true', () => {
    const plugin = debugPlugin(true)
    const style = { color: 'blue' }

    const result = plugin(style)

    expect(result.outline).toBe('1px solid red')
    expect(result.backgroundColor).toBe('rgba(255,0,0,0.1)')
    expect(result.color).toBe('blue')
  })

  test('does not add debug styles when autoActive is false and no debug flag', () => {
    const plugin = debugPlugin(false)
    const style = { color: 'blue' }

    const result = plugin(style)

    expect(result.outline).toBeUndefined()
    expect(result.color).toBe('blue')
  })

  test('adds debug styles when debug flag is true', () => {
    const plugin = debugPlugin(false)
    const style = { color: 'blue', debug: true }

    const result = plugin(style)

    expect(result.outline).toBe('1px solid red')
    expect(result.debug).toBeUndefined() // debug flag should be removed
  })

  test('removes debug property from result', () => {
    const plugin = debugPlugin(true)
    const style = { color: 'blue', debug: true }

    const result = plugin(style)

    expect(result.debug).toBeUndefined()
  })

  test('preserves original styles', () => {
    const plugin = debugPlugin(true)
    const style = {
      color: 'red',
      fontSize: 16,
      padding: 10,
    }

    const result = plugin(style)

    expect(result.color).toBe('red')
    expect(result.fontSize).toBe(16)
    expect(result.padding).toBe(10)
  })
})

