import { describe, test, expect } from 'vitest'

import {
  createEnumSchema,
  createStringSchema,
  createNumberSchema,
  createBooleanSchema,
  createArraySchema,
  createObjectSchema,
} from '../builders'

describe('createEnumSchema', () => {
  test('creates basic enum schema', () => {
    const schema = createEnumSchema(['a', 'b', 'c'])

    expect(schema.enum).toEqual(['a', 'b', 'c'])
  })

  test('creates enum schema with options', () => {
    const schema = createEnumSchema(['a', 'b'], {
      description: 'Test enum',
      default: 'a',
    })

    expect(schema.enum).toEqual(['a', 'b'])
    expect(schema.description).toBe('Test enum')
    expect(schema.default).toBe('a')
  })
})

describe('createStringSchema', () => {
  test('creates basic string schema', () => {
    const schema = createStringSchema()

    expect(schema.type).toBe('string')
  })

  test('creates string schema with all options', () => {
    const schema = createStringSchema({
      minLength: 1,
      maxLength: 100,
      format: 'email',
      description: 'Email address',
      default: 'test@example.com',
    })

    expect(schema.type).toBe('string')
    expect(schema.minLength).toBe(1)
    expect(schema.maxLength).toBe(100)
    expect(schema.format).toBe('email')
    expect(schema.description).toBe('Email address')
    expect(schema.default).toBe('test@example.com')
  })
})

describe('createNumberSchema', () => {
  test('creates basic number schema', () => {
    const schema = createNumberSchema()

    expect(schema.type).toBe('number')
  })

  test('creates number schema with constraints', () => {
    const schema = createNumberSchema({
      minimum: 0,
      maximum: 100,
      description: 'Percentage',
      default: 50,
    })

    expect(schema.type).toBe('number')
    expect(schema.minimum).toBe(0)
    expect(schema.maximum).toBe(100)
    expect(schema.description).toBe('Percentage')
    expect(schema.default).toBe(50)
  })
})

describe('createBooleanSchema', () => {
  test('creates basic boolean schema', () => {
    const schema = createBooleanSchema()

    expect(schema.type).toBe('boolean')
  })

  test('creates boolean schema with options', () => {
    const schema = createBooleanSchema({
      description: 'Is active',
      default: true,
    })

    expect(schema.type).toBe('boolean')
    expect(schema.description).toBe('Is active')
    expect(schema.default).toBe(true)
  })
})

describe('createArraySchema', () => {
  test('creates array schema with items', () => {
    const schema = createArraySchema({ type: 'string' })

    expect(schema.type).toBe('array')
    expect(schema.items).toEqual({ type: 'string' })
  })

  test('creates array schema with options', () => {
    const schema = createArraySchema<number>({ type: 'number' }, {
      description: 'List of numbers',
      default: [1, 2, 3],
    })

    expect(schema.type).toBe('array')
    expect(schema.description).toBe('List of numbers')
    expect(schema.default).toEqual([1, 2, 3])
  })
})

describe('createObjectSchema', () => {
  test('creates object schema with properties', () => {
    const schema = createObjectSchema({
      name: { type: 'string' },
      age: { type: 'number' },
    })

    expect(schema.type).toBe('object')
    expect(schema.properties.name).toEqual({ type: 'string' })
    expect(schema.properties.age).toEqual({ type: 'number' })
  })

  test('creates object schema with options', () => {
    const schema = createObjectSchema(
      {
        name: { type: 'string' },
      },
      {
        required: ['name'],
        description: 'A person',
      }
    )

    expect(schema.type).toBe('object')
    expect(schema.required).toEqual(['name'])
    expect(schema.description).toBe('A person')
  })
})

