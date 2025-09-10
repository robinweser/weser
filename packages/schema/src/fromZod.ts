import z, { ZodType } from 'zod'

import { T_JSONSchema } from './types.js'

export default function fromZod(schema: ZodType) {
  return z.toJSONSchema(schema) as T_JSONSchema
}
