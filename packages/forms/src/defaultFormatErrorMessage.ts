import { $ZodIssue } from '@zod/core'

export default function defaultFormatErrorMessage(error: $ZodIssue) {
  return error.message
}
