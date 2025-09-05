import { ChangeEvent, useEffect, useState } from 'react'
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
    _onInit,
    _onUpdate,
    _storedField,
  }: Options<T> = {}
) {
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

  const [field, setField] = useState<Field<T>>(_storedField ?? initialField)

  useEffect(() => {
    if (_onInit && !_storedField) {
      _onInit(field)
    }
  }, [_onInit, _storedField])

  function update(data: Partial<Field<T>>) {
    if (data.value !== undefined) {
      const dirty = data.value !== initialField.value
      const errorMessage = _validate(data.value)

      const _data = {
        touched: showValidationOn === 'change' ? dirty : field.touched,
        dirty,
        ...data,
        errorMessage,
        valid: !errorMessage,
      }

      if (_onUpdate) {
        _onUpdate(_data)
      }

      setField((field: Field<T>) => ({
        ...field,
        ..._data,
      }))
    } else {
      if (_onUpdate) {
        _onUpdate(data)
      }

      setField((field: Field<T>) => ({
        ...field,
        ...data,
      }))
    }
  }

  function reset() {
    if (_onUpdate) {
      _onUpdate(initialField)
    }

    setField(initialField)
  }

  function validate() {
    return schema.safeParse(field.value)
  }

  function onChange(e: C) {
    update({ value: parseValue(e) })
  }

  // Only show validation error when is touched
  const valid = !field.touched ? true : !field.errorMessage
  // Only show errrorMessage and validation styles if the field is touched according to the config
  const errorMessage = field.touched ? field.errorMessage : undefined

  const touch = () => update({ touched: true })
  const untouch = () => update({ touched: false })

  function getListeners() {
    if (showValidationOn === 'blur') {
      return {
        onFocus: untouch,
        onBlur: touch,
      }
    }

    return {
      onFocus: untouch,
    }
  }

  const inputProps = {
    value: field.value,
    disabled: field.disabled,
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
    errorMessage,
    onChange,
    ...getListeners(),
  }

  return {
    ...field,
    valid,
    update,
    reset,
    validate,
    errorMessage,
    inputProps,
    props,
    _initial: initialField,
  }
}
