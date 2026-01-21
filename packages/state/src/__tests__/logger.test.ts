import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'

import logger from '../middleware/logger'

describe('logger middleware', () => {
  const originalConsole = console.log

  beforeEach(() => {
    console.log = vi.fn()
  })

  afterEach(() => {
    console.log = originalConsole
  })

  test('returns middleware function', () => {
    const { middleware } = logger()

    expect(middleware).toBeDefined()
    expect(typeof middleware).toBe('function')
  })

  test('logs action with default prefix', () => {
    const { middleware } = logger()

    middleware({ count: 1 }, {
      action: 'increment',
      payload: [],
      prevState: { count: 0 },
    })

    expect(console.log).toHaveBeenCalledWith(
      'ALVERON:increment',
      expect.objectContaining({
        payload: [],
        prevState: { count: 0 },
        nextState: { count: 1 },
      })
    )
  })

  test('uses custom prefix', () => {
    const { middleware } = logger({ prefix: 'CUSTOM:' })

    middleware({ value: 'test' }, {
      action: 'setValue',
      payload: ['test'],
      prevState: { value: '' },
    })

    expect(console.log).toHaveBeenCalledWith(
      'CUSTOM:setValue',
      expect.any(Object)
    )
  })

  test('returns nextState unchanged', () => {
    const { middleware } = logger()
    const nextState = { count: 5 }

    const result = middleware(nextState, {
      action: 'test',
      payload: [],
      prevState: {},
    })

    expect(result).toBe(nextState)
  })

  test('logs payload', () => {
    const { middleware } = logger()

    middleware({}, {
      action: 'setValues',
      payload: ['arg1', 'arg2'],
      prevState: {},
    })

    expect(console.log).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        payload: ['arg1', 'arg2'],
      })
    )
  })
})
