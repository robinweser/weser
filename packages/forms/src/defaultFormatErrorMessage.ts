import { ZodIssue } from 'zod'

export default function defaultFormatErrorMessage(error: ZodIssue) {
  return error.message
}
