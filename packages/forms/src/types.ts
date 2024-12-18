import { ZodIssue } from 'zod'

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
  formatErrorMessage?: (error: ZodIssue, name?: string) => string
  _onUpdateValue?: (value: T, dirty: boolean) => void
}
