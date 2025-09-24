import { $ZodIssue } from 'zod/v4/core'

export type Field<T> = {
  value: T
  disabled: boolean
  touched: boolean
  dirty: boolean
  valid: boolean
  errorMessage?: string
}

export type Options<T> = {
  name?: string
  value?: T
  disabled?: boolean
  touched?: boolean
  showValidationOn?: 'submit' | 'blur' | 'change'
  parseValue?: (e: any) => T
  formatErrorMessage?: (error: $ZodIssue, value: T, name?: string) => string
  _onInit?: (field: Field<T>) => void
  _onUpdate?: (field: Partial<Field<T>>) => void
  _storedField?: Field<T>
}
