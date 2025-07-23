import { useEffect, useRef, useState, FormEvent, ChangeEvent } from 'react'
import { z, ZodObject, ZodError, ZodRawShape, ZodIssue } from 'zod'

import { Field, Options } from './types.js'
import defaultFormatErrorMessage from './defaultFormatErrorMessage.js'
import useField from './useField.js'

type Ref<T> = Field<T>

type FieldReference = {
  ref: {
    current: Field<any>
  }
  update: (data: Partial<Field<any>>) => void
  reset: () => void
}

type FieldsMap = Record<string, FieldReference>

function mapFieldsToData(fields: Record<string, any>): Record<string, any> {
  const obj: Record<string, any> = {}
  for (const name in fields) {
    obj[name] = fields[name].ref.current.value
  }

  return obj
}

export default function useForm<S extends ZodRawShape>(
  schema: ZodObject<S>,
  formatErrorMessage: (
    error: ZodIssue,
    value: any,
    name: string
  ) => string = defaultFormatErrorMessage
) {
  const [fields, setFields] = useState<FieldsMap>({})

  function useFormField<T = string, C = ChangeEvent<HTMLInputElement>>(
    name: keyof S,
    options: Omit<
      Options<T>,
      'formatErrorMessage' | 'name' | '_onUpdateValue' | '_storedField'
    > = {}
  ) {
    const shape = schema.shape[name]
    const stored = fields[name as string]?.ref.current as Ref<T> | undefined
    // @ts-ignore
    const field = useField<T, C>(shape, {
      ...options,
      name: name as string,
      formatErrorMessage,
      _storedField: stored,
      _onUpdateValue: (value, dirty) => {
        ref.current.value = value
        ref.current.dirty = dirty
      },
    })

    const ref = useRef<Ref<T>>(stored ?? { ...field })

    useEffect(() => {
      ref.current = { ...field }
    })

    function reset() {
      ref.current = { ...field.initial }

      field.reset()
    }

    useEffect(
      () =>
        setFields((fields: FieldsMap) => ({
          ...fields,
          [name]: {
            ref,
            update: field.update,
            reset,
          },
        })),
      []
    )

    return {
      ...field,
      reset,
    }
  }

  function touchFields() {
    for (const name in fields) {
      fields[name].update({ touched: true })
    }
  }

  function reset() {
    for (const name in fields) {
      fields[name].reset()
    }
  }

  function isDirty() {
    for (const name in fields) {
      if (fields[name].ref.current.dirty) {
        return true
      }
    }

    return false
  }

  function handleSubmit(
    onSubmit: (data: z.infer<typeof schema>) => void,
    onError?: (error: ZodError) => void
  ) {
    return (e: FormEvent<HTMLFormElement>) => {
      e.stopPropagation()
      e.preventDefault()

      touchFields()

      const data = mapFieldsToData(fields)
      const parsed = schema.safeParse(data)

      if (parsed.success) {
        onSubmit(parsed.data)
      } else {
        if (onError) {
          onError(parsed.error)
        }
      }
    }
  }

  const formProps = {
    noValidate: true,
  }

  return {
    useFormField,
    handleSubmit,
    formProps,
    isDirty,
    reset,
  }
}
