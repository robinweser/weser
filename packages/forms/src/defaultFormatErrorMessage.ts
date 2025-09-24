import { $ZodIssue } from 'zod/v4/core'

export default function defaultFormatErrorMessage(error: $ZodIssue) {
  return error.message
}
