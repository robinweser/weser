import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'

import loggerPlugin from '../logger'

describe('loggerPlugin', () => {
  const originalConsole = console.log

  beforeEach(() => {
    console.log = vi.fn()
  })

  afterEach(() => {
    console.log = originalConsole
  })

  test('logs style object', () => {
    const plugin = loggerPlugin()
    const style = { color: 'red', fontSize: 16 }

    plugin(style)

    expect(console.log).toHaveBeenCalledWith(expect.objectContaining(style))
  })

  test('returns the original style unchanged', () => {
    const plugin = loggerPlugin()
    const style = { color: 'red' }

    const result = plugin(style)

    expect(result).toBe(style)
  })

  test('uses prefix when provided', () => {
    const plugin = loggerPlugin({ prefix: 'STYLE:' })
    const style = { color: 'blue' }

    plugin(style)

    expect(console.log).toHaveBeenCalledWith('STYLE:', expect.any(Object))
  })

  test('stringifies when stringify option is true', () => {
    const plugin = loggerPlugin({ stringify: true })
    const style = { color: 'green' }

    plugin(style)

    expect(console.log).toHaveBeenCalledWith(JSON.stringify(style))
  })

  test('clones style by default', () => {
    const plugin = loggerPlugin()
    const style = { color: 'red' }

    plugin(style)

    const loggedValue = (console.log as any).mock.calls[0][0]
    expect(loggedValue).not.toBe(style)
    expect(loggedValue).toEqual(style)
  })

  test('does not clone when clone is false', () => {
    const plugin = loggerPlugin({ clone: false })
    const style = { color: 'red' }

    plugin(style)

    const loggedValue = (console.log as any).mock.calls[0][0]
    expect(loggedValue).toBe(style)
  })

  test('prefix and stringify work together', () => {
    const plugin = loggerPlugin({ prefix: 'DEBUG:', stringify: true })
    const style = { margin: 10 }

    plugin(style)

    expect(console.log).toHaveBeenCalledWith('DEBUG:', JSON.stringify(style))
  })
})

