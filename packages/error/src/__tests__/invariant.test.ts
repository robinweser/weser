import { describe, test, expect } from 'vitest'

import invariant from '../invariant'

describe('invariant', () => {
  test('does not throw when condition is true', () => {
    expect(() => invariant(true, 'Error message')).not.toThrow()
  })

  test('throws when condition is false', () => {
    expect(() => invariant(false, 'Error message')).toThrow()
  })

  test('uses correct error message', () => {
    const message = 'This is a custom error message'

    expect(() => invariant(false, message)).toThrowError(message)
  })

  test('throws Error instance', () => {
    expect(() => invariant(false, 'Error')).toThrowError(Error)
  })

  test('works with truthy values as condition', () => {
    expect(() => invariant(1 === 1, 'Error')).not.toThrow()
    expect(() => invariant(Boolean('string'), 'Error')).not.toThrow()
  })

  test('works with falsy values as condition', () => {
    // @ts-expect-error - we want to test the falsy values
    expect(() => invariant(1 === 2, 'Error')).toThrow()
    expect(() => invariant(Boolean(''), 'Error')).toThrow()
  })
})
