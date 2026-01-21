import { describe, test, expect } from 'vitest'
import z from 'zod'

import fromZod from '../fromZod'

describe('fromZod', () => {
  test('converts zod string to JSON schema', () => {
    const zodSchema = z.string()
    const jsonSchema = fromZod(zodSchema)

    expect(jsonSchema.type).toBe('string')
  })

  test('converts zod number to JSON schema', () => {
    const zodSchema = z.number()
    const jsonSchema = fromZod(zodSchema)

    expect(jsonSchema.type).toBe('number')
  })

  test('converts zod boolean to JSON schema', () => {
    const zodSchema = z.boolean()
    const jsonSchema = fromZod(zodSchema)

    expect(jsonSchema.type).toBe('boolean')
  })

  test('converts zod enum to JSON schema', () => {
    const zodSchema = z.enum(['a', 'b', 'c'])
    const jsonSchema = fromZod(zodSchema)

    expect(jsonSchema.enum).toEqual(['a', 'b', 'c'])
  })

  test('converts zod object to JSON schema', () => {
    const zodSchema = z.object({
      name: z.string(),
      age: z.number(),
    })
    const jsonSchema = fromZod(zodSchema)

    expect(jsonSchema.type).toBe('object')
    expect(jsonSchema.properties).toBeDefined()
  })

  test('converts zod array to JSON schema', () => {
    const zodSchema = z.array(z.string())
    const jsonSchema = fromZod(zodSchema)

    expect(jsonSchema.type).toBe('array')
    expect(jsonSchema.items).toBeDefined()
  })

  test('preserves string constraints', () => {
    const zodSchema = z.string().min(1).max(100)
    const jsonSchema = fromZod(zodSchema)

    expect(jsonSchema.type).toBe('string')
    expect(jsonSchema.minLength).toBe(1)
    expect(jsonSchema.maxLength).toBe(100)
  })

  test('preserves number constraints', () => {
    const zodSchema = z.number().min(0).max(100)
    const jsonSchema = fromZod(zodSchema)

    expect(jsonSchema.type).toBe('number')
    expect(jsonSchema.minimum).toBe(0)
    expect(jsonSchema.maximum).toBe(100)
  })

  test('preserves description', () => {
    const zodSchema = z.string().describe('A test description')
    const jsonSchema = fromZod(zodSchema)

    expect(jsonSchema.description).toBe('A test description')
  })
})

