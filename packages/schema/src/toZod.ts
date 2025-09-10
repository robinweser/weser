import z, { ZodAny, ZodArray, ZodType, ZodString } from 'zod'
import {
  isBooleanSchema,
  isEnumSchema,
  isNumberSchema,
  isObjectSchema,
  isArraySchema,
  isStringSchema,
} from './guards.js'
import {
  T_JSONSchema,
  T_JSONSchemaBoolean,
  T_JSONSchemaEnum,
  T_JSONSchemaNumber,
  T_JSONSchemaObject,
  T_JSONSchemaArray,
  T_JSONSchemaString,
} from './types.js'

export default function toZod(schema: T_JSONSchema) {
  if (isEnumSchema(schema)) {
    return toZodEnum(schema)
  }

  if (isStringSchema(schema)) {
    return toZodString(schema)
  }

  if (isNumberSchema(schema)) {
    return toZodNumber(schema)
  }

  if (isBooleanSchema(schema)) {
    return toZodBoolean(schema)
  }

  if (isObjectSchema(schema)) {
    return toZodObject(schema)
  }

  if (isArraySchema(schema)) {
    return toZodArray(schema)
  }

  throw new Error('Error converting JSON schema to Zod type.')
}

export function toZodString({
  minLength,
  maxLength,
  description,
  default: _default,
  format,
  ...meta
}: T_JSONSchemaString) {
  let type: ZodString = z.string()

  if (format === 'uri') {
    type = type.url()
  } else if (format === 'date') {
    type = type.date()
  }

  type = type.meta({ ...meta, ...(format ? { format } : {}) })

  if (description) {
    type = type.describe(description)
  }

  if (minLength) {
    type = type.min(minLength)
  }

  if (maxLength) {
    type = type.max(maxLength)
  }

  if (_default) {
    return type.default(_default)
  }

  return type
}

export function toZodEnum({
  enum: _enum,
  description,
  default: _default,
  ...meta
}: T_JSONSchemaEnum) {
  let type = z.enum(_enum)

  type = type.meta(meta)

  if (description) {
    type = type.describe(description)
  }

  if (_default) {
    return type.default(_default)
  }

  return type
}

export function toZodNumber({
  minimum,
  maximum,
  description,
  default: _default,
  ...meta
}: T_JSONSchemaNumber) {
  let type = z.number()

  type = type.meta(meta)

  if (description) {
    type = type.describe(description)
  }

  if (minimum) {
    type = type.min(minimum)
  }

  if (maximum) {
    type = type.max(maximum)
  }

  if (_default) {
    return type.default(_default)
  }

  return type
}

export function toZodBoolean({
  description,
  default: _default,
  ...meta
}: T_JSONSchemaBoolean) {
  let type = z.boolean()

  type = type.meta(meta)

  if (description) {
    type = type.describe(description)
  }

  if (_default) {
    return type.default(_default)
  }

  return type
}

export function toZodObject({
  properties,
  required,
  description,
  ...meta
}: T_JSONSchemaObject) {
  const props = Object.entries(properties).reduce(
    (props, [property, schema]) => {
      const type = toZod(schema)

      if (type) {
        props[property] = type
      }

      return props
    },
    {} as Record<string, ZodType>
  )

  let type = z.object(props)

  type = type.meta(meta)

  if (description) {
    type = type.describe(description)
  }

  return type
}

export function toZodArray({
  items,
  description,
  default: _default,
  ...meta
}: T_JSONSchemaArray) {
  let type = z.array(toZod(items)) as unknown as ZodArray<ZodAny>

  type = type.meta(meta)

  if (description) {
    type = type.describe(description)
  }

  if (_default) {
    return type.default(_default)
  }

  return type
}
