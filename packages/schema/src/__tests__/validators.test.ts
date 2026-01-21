import { describe, test, expect } from 'vitest'

import {
  isValidEnumSchema,
  isValidStringSchema,
  isValidNumberSchema,
  isValidBooleanSchema,
  isValidArraySchema,
  isValidObjectSchema,
  isValidSchema,
} from '../validators'

describe('isValidEnumSchema', () => {
  test('returns true for valid enum schema', () => {
    expect(isValidEnumSchema({ enum: ['a', 'b', 'c'] })).toBe(true)
  })

  test('returns true for enum schema with options', () => {
    expect(
      isValidEnumSchema({ enum: ['a', 'b'], description: 'Test', default: 'a' })
    ).toBe(true)
  })

  test('returns false for invalid enum schema', () => {
    expect(isValidEnumSchema({ type: 'string' })).toBe(false)
  })
})

describe('isValidStringSchema', () => {
  test('returns true for valid string schema', () => {
    expect(isValidStringSchema({ type: 'string' })).toBe(true)
  })

  test('returns true for string schema with all options', () => {
    expect(
      isValidStringSchema({
        type: 'string',
        minLength: 1,
        maxLength: 100,
        format: 'uri',
        description: 'A URL',
        default: 'https://example.com',
      })
    ).toBe(true)
  })

  test('returns false for invalid string schema', () => {
    expect(isValidStringSchema({ type: 'number' })).toBe(false)
  })
})

describe('isValidNumberSchema', () => {
  test('returns true for valid number schema', () => {
    expect(isValidNumberSchema({ type: 'number' })).toBe(true)
  })

  test('returns true for number schema with constraints', () => {
    expect(
      isValidNumberSchema({
        type: 'number',
        minimum: 0,
        maximum: 100,
        description: 'A percentage',
        default: 50,
      })
    ).toBe(true)
  })

  test('returns false for invalid number schema', () => {
    expect(isValidNumberSchema({ type: 'string' })).toBe(false)
  })
})

describe('isValidBooleanSchema', () => {
  test('returns true for valid boolean schema', () => {
    expect(isValidBooleanSchema({ type: 'boolean' })).toBe(true)
  })

  test('returns true for boolean schema with options', () => {
    expect(
      isValidBooleanSchema({
        type: 'boolean',
        description: 'Is active',
        default: false,
      })
    ).toBe(true)
  })

  test('returns false for invalid boolean schema', () => {
    expect(isValidBooleanSchema({ type: 'string' })).toBe(false)
  })
})

describe('isValidArraySchema', () => {
  test('returns true for valid array schema', () => {
    expect(
      isValidArraySchema({ type: 'array', items: { type: 'string' } })
    ).toBe(true)
  })

  test('returns true for array schema with options', () => {
    expect(
      isValidArraySchema({
        type: 'array',
        items: { type: 'number' },
        description: 'List of numbers',
        default: [1, 2, 3],
      })
    ).toBe(true)
  })

  test('returns false for invalid array schema', () => {
    expect(isValidArraySchema({ type: 'object', properties: {} })).toBe(false)
  })
})

describe('isValidObjectSchema', () => {
  test('returns true for valid object schema', () => {
    expect(isValidObjectSchema({ type: 'object', properties: {} })).toBe(true)
  })

  test('returns true for object schema with properties', () => {
    expect(
      isValidObjectSchema({
        type: 'object',
        properties: {
          name: { type: 'string' },
          age: { type: 'number' },
        },
        required: ['name'],
        description: 'A person',
      })
    ).toBe(true)
  })

  test('returns false for invalid object schema', () => {
    expect(isValidObjectSchema({ type: 'array', items: {} })).toBe(false)
  })
})

describe('isValidSchema', () => {
  test('returns true for any valid schema type', () => {
    expect(isValidSchema({ enum: ['a', 'b'] })).toBe(true)
    expect(isValidSchema({ type: 'string' })).toBe(true)
    expect(isValidSchema({ type: 'number' })).toBe(true)
    expect(isValidSchema({ type: 'boolean' })).toBe(true)
    expect(isValidSchema({ type: 'array', items: { type: 'string' } })).toBe(
      true
    )
    expect(isValidSchema({ type: 'object', properties: {} })).toBe(true)
  })

  test('returns false for invalid schema', () => {
    expect(isValidSchema({ invalid: true } as any)).toBe(false)
  })
})

