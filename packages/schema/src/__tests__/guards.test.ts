import { describe, test, expect } from 'vitest'

import {
  isEnumSchema,
  isStringSchema,
  isNumberSchema,
  isBooleanSchema,
  isObjectSchema,
  isArraySchema,
} from '../guards'

describe('isEnumSchema', () => {
  test('returns true for enum schema', () => {
    expect(isEnumSchema({ enum: ['a', 'b'] })).toBe(true)
  })

  test('returns false for non-enum schema', () => {
    expect(isEnumSchema({ type: 'string' })).toBe(false)
  })
})

describe('isStringSchema', () => {
  test('returns true for string schema', () => {
    expect(isStringSchema({ type: 'string' })).toBe(true)
  })

  test('returns true for string schema with options', () => {
    expect(isStringSchema({ type: 'string', minLength: 1, format: 'uri' })).toBe(
      true
    )
  })

  test('returns false for non-string schema', () => {
    expect(isStringSchema({ type: 'number' })).toBe(false)
  })
})

describe('isNumberSchema', () => {
  test('returns true for number schema', () => {
    expect(isNumberSchema({ type: 'number' })).toBe(true)
  })

  test('returns true for number schema with constraints', () => {
    expect(isNumberSchema({ type: 'number', minimum: 0, maximum: 100 })).toBe(
      true
    )
  })

  test('returns false for non-number schema', () => {
    expect(isNumberSchema({ type: 'string' })).toBe(false)
  })
})

describe('isBooleanSchema', () => {
  test('returns true for boolean schema', () => {
    expect(isBooleanSchema({ type: 'boolean' })).toBe(true)
  })

  test('returns true for boolean schema with default', () => {
    expect(isBooleanSchema({ type: 'boolean', default: true })).toBe(true)
  })

  test('returns false for non-boolean schema', () => {
    expect(isBooleanSchema({ type: 'string' })).toBe(false)
  })
})

describe('isObjectSchema', () => {
  test('returns true for object schema', () => {
    expect(isObjectSchema({ type: 'object', properties: {} })).toBe(true)
  })

  test('returns true for object schema with properties', () => {
    expect(
      isObjectSchema({
        type: 'object',
        properties: { name: { type: 'string' } },
      })
    ).toBe(true)
  })

  test('returns false for non-object schema', () => {
    expect(isObjectSchema({ type: 'array', items: { type: 'string' } })).toBe(
      false
    )
  })
})

describe('isArraySchema', () => {
  test('returns true for array schema', () => {
    expect(isArraySchema({ type: 'array', items: { type: 'string' } })).toBe(
      true
    )
  })

  test('returns false for non-array schema', () => {
    expect(isArraySchema({ type: 'object', properties: {} })).toBe(false)
  })
})

