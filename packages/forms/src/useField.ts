import { ChangeEvent, useState } from 'react'
import { ZodType } from 'zod'

import { Field, Options } from './types.js'
import defaultFormatErrorMessage from './defaultFormatErrorMessage.js'
import defaultParseValue from './defaultParseValue.js'

export default function useField<T = string, C = ChangeEvent<HTMLInputElement>>(
  schema: ZodType,
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

  function _validate(value: T): undefined | string {
    const { success, error } = schema.safeParse(value)

    if (!success) {
      return formatErrorMessage(error.issues[0], value, name)
    }
  }

  const message = _validate(value)

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
      const errorMessage = _validate(data.value)

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

  function validate() {
    return schema.safeParse(field.value)
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
    validate,
    errorMessage,
    inputProps,
    initial: initialField,
    props,
  }
}
