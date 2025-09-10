import z from 'zod'
import {
  T_JSONSchemaEnum,
  T_JSONSchemaString,
  T_JSONSchemaNumber,
  T_JSONSchemaBoolean,
  T_JSONSchemaObject,
  T_JSONSchemaArray,
  T_JSONSchema,
} from './types.js'

const enumValidator = z
  .object({
    enum: z.array(z.string()),
    description: z.string().optional(),
    default: z.string().optional(),
  })
  .passthrough()

export function isValidEnumSchema(
  schema: T_JSONSchema
): schema is T_JSONSchemaEnum {
  return enumValidator.safeParse(schema).success
}

const stringValidator = z
  .object({
    type: z.literal('string'),
    minLength: z.number().optional(),
    maxLength: z.number().optional(),
    format: z.enum(['date', 'uri']).optional(),
    description: z.string().optional(),
    default: z.string().optional(),
  })
  .passthrough()

export function isValidStringSchema(
  schema: T_JSONSchema
): schema is T_JSONSchemaString {
  return stringValidator.safeParse(schema).success
}

const numberValidator = z
  .object({
    type: z.literal('number'),
    minimum: z.number().optional(),
    maximum: z.number().optional(),
    description: z.string().optional(),
    default: z.number().optional(),
  })
  .passthrough()

export function isValidNumberSchema(
  schema: T_JSONSchema
): schema is T_JSONSchemaNumber {
  return numberValidator.safeParse(schema).success
}

const booleanValidator = z
  .object({
    type: z.literal('boolean'),
    description: z.string().optional(),
    default: z.boolean().optional(),
  })
  .passthrough()

export function isValidBooleanSchema(
  schema: T_JSONSchema
): schema is T_JSONSchemaBoolean {
  return booleanValidator.safeParse(schema).success
}

const arrayValidator = z
  .object({
    type: z.literal('array'),
    items: z.any(),
    description: z.string().optional(),
    default: z.array(z.any()).optional(),
  })
  .passthrough()

export function isValidArraySchema(
  schema: T_JSONSchema
): schema is T_JSONSchemaArray {
  return arrayValidator.safeParse(schema).success
}

const objectValidator = z
  .object({
    type: z.literal('object'),
    properties: z.record(z.string(), z.any()),
    required: z.array(z.string()).optional(),
    description: z.string().optional(),
    default: z.record(z.string(), z.any()).optional(),
  })
  .passthrough()

export function isValidObjectSchema(
  schema: T_JSONSchema
): schema is T_JSONSchemaObject {
  return objectValidator.safeParse(schema).success
}

export function isValidSchema(schema: T_JSONSchema): schema is T_JSONSchema {
  return (
    isValidEnumSchema(schema) ||
    isValidStringSchema(schema) ||
    isValidNumberSchema(schema) ||
    isValidBooleanSchema(schema) ||
    isValidObjectSchema(schema) ||
    isValidArraySchema(schema)
  )
}
