export type T_JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONObject
  | Array<T_JSONValue>

export type JSONObject = {
  [key: string]: T_JSONValue
}

export type T_JSONSchemaRaw = {
  description?: string
  [key: string]: any
}

export type T_JSONSchemaEnum = T_JSONSchemaRaw & {
  enum: Array<string>
  default?: string
}

export type T_JSONSchemaString = T_JSONSchemaRaw & {
  type: 'string'
  minLength?: number
  maxLength?: number
  format?: 'date' | 'uri'
  default?: string
}

export type T_JSONSchemaNumber = T_JSONSchemaRaw & {
  type: 'number'
  minimum?: number
  maximum?: number
  default?: number
}

export type T_JSONSchemaBoolean = T_JSONSchemaRaw & {
  type: 'boolean'
  default?: boolean
}

export interface T_JSONSchemaArray<T = T_JSONValue>
  extends T_JSONSchemaRaw {
  type: 'array'
  items: T_JSONSchema
  default?: Array<T>
}

export interface T_JSONSchemaObject<
  T extends Record<string, any> = Record<string, T_JSONValue>,
> extends T_JSONSchemaRaw {
  type: 'object'
  required?: Array<keyof T>
  properties: Record<string, T_JSONSchema>
  default?: T
}

export type T_JSONSchema =
  | T_JSONSchemaEnum
  | T_JSONSchemaString
  | T_JSONSchemaNumber
  | T_JSONSchemaBoolean
  | T_JSONSchemaObject
  | T_JSONSchemaArray
