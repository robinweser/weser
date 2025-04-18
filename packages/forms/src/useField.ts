import { ChangeEvent, useState } from 'react'
import { ZodIssue, ZodObject, ZodRawShape, ZodSchema } from 'zod'

import { Field, Options } from './types.js'
import defaultFormatErrorMessage from './defaultFormatErrorMessage.js'
import defaultParseValue from './defaultParseValue.js'

export default function useField<T = string, C = ChangeEvent<HTMLInputElement>>(
  schema: ZodSchema,
  {
    name,
    value = '' as T,
    disabled = false,
    touched = false,
    showValidationOn = 'submit',
    parseValue = defaultParseValue<T>,
    formatErrorMessage = defaultFormatErrorMessage,
    _onUpdateValue,
  }: Options<T> = {}
) {
  const isOptional = schema.isOptional()

  function validate(value: T): undefined | string {
    const res = schema.safeParse(value)

    if (res.success) {
      return
    } else {
      return formatErrorMessage(res.error.errors[0], name)
    }
  }

  const message = validate(value)

  const initialField = {
    value,
    disabled,
    touched,
    dirty: false,
    valid: !message,
    errorMessage: message,
  }

  const [field, setField] = useState<Field<T>>(initialField)

  function update(data: Partial<Field<T>>) {
    if (data.value !== undefined) {
      const dirty = data.value !== initialField.value
      const errorMessage = validate(data.value)

      if (_onUpdateValue) {
        _onUpdateValue(data.value, dirty)
      }

      setField((field: Field<T>) => ({
        ...field,
        touched: showValidationOn === 'change' ? dirty : field.touched,
        dirty,
        ...data,
        errorMessage,
        valid: !errorMessage,
      }))
    } else {
      setField((field: Field<T>) => ({
        ...field,
        ...data,
      }))
    }
  }

  function reset() {
    setField(initialField)
  }

  function onChange(e: C) {
    update({ value: parseValue(e) })
  }

  const required = !isOptional
  // Only show validation error when is touched
  const valid = !field.touched ? true : !field.errorMessage
  // Only show errrorMessage and validation styles if the field is touched according to the config
  const errorMessage = field.touched ? field.errorMessage : undefined

  const touch = () => update({ touched: false })
  const untouch = () => update({ touched: false })

  function getListeners() {
    if (showValidationOn === 'blur') {
      return {
        onFocus: touch,
        onBlur: untouch,
      }
    }

    return {
      onFocus: touch,
    }
  }

  const inputProps = {
    value: field.value,
    disabled: field.disabled,
    required,
    name,
    'data-valid': valid,
    onChange,
    ...getListeners(),
  }

  const props = {
    value: field.value,
    disabled: field.disabled,
    name,
    valid,
    required,
    errorMessage,
    onChange,
    ...getListeners(),
  }

  return {
    ...field,
    required,
    valid,
    update,
    reset,
    errorMessage,
    inputProps,
    initial: initialField,
    props,
  }
}
