import {
  T_JSONSchemaEnum,
  T_JSONSchemaString,
  T_JSONSchemaNumber,
  T_JSONSchemaBoolean,
  T_JSONSchemaArray,
  T_JSONSchemaObject,
  T_JSONSchema,
} from './types.js'

export function createEnumSchema(
  values: ReadonlyArray<string>,
  options: { description?: string; default?: string } = {}
): T_JSONSchemaEnum {
  return { enum: [...values], ...options }
}

export function createStringSchema(
  options: {
    minLength?: number
    maxLength?: number
    format?: 'date' | 'uri' | 'email'
    description?: string
    default?: string
  } = {}
): T_JSONSchemaString {
  return { type: 'string', ...options }
}

export function createNumberSchema(
  options: {
    minimum?: number
    maximum?: number
    description?: string
    default?: number
  } = {}
): T_JSONSchemaNumber {
  return { type: 'number', ...options }
}

export function createBooleanSchema(
  options: { description?: string; default?: boolean } = {}
): T_JSONSchemaBoolean {
  return { type: 'boolean', ...options }
}

export function createArraySchema<T>(
  items: T_JSONSchema,
  options: { description?: string; default?: Array<T> } = {}
): T_JSONSchemaArray<T> {
  return { type: 'array', items, ...options }
}

export function createObjectSchema<T extends Record<string, any>>(
  properties: { [K in keyof T]: T_JSONSchema },
  options: {
    required?: Array<keyof T>
    description?: string
    default?: T
  } = {}
): T_JSONSchemaObject<T> {
  return { type: 'object', properties, ...options }
}
