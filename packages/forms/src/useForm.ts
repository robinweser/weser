import { useEffect, useRef, useState, FormEvent, ChangeEvent } from 'react'
import {
  z,
  ZodObject,
  ZodError,
  ZodRawShape,
  ZodIssue,
  ZodTypeAny,
  ZodArray,
  ZodType,
} from 'zod'

import { Field, Options } from './types.js'
import defaultFormatErrorMessage from './defaultFormatErrorMessage.js'
import useField from './useField.js'

type Ref<T> = {
  value: T
  dirty: boolean
}

type FieldReference = {
  ref: {
    current: {
      value: any
      dirty: boolean
    }
  }
  update: (data: Partial<Field<any>>) => void
  reset: () => void
}

type FieldsMap = Record<string, FieldReference>

function setNestedValue(obj: Record<string, any>, path: string, value: any) {
  const keys = path.split('.')
  let current = obj
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (!current[key]) {
      current[key] = {}
    }
    current = current[key]
  }

  current[keys[keys.length - 1]] = value
}

function getNestedValue(obj: Record<string, any>, path: string) {
  const keys = path.split('.')
  let current: any = obj

  for (const key of keys) {
    if (current == null) {
      return undefined
    }
    current = current[key]
  }

  return current
}

function normalizeArrays(
  obj: Record<string, any>,
  arrays: Record<string, string[]>
) {
  const paths = Object.keys(arrays).sort(
    (a, b) => b.split('.').length - a.split('.').length
  )

  for (const path of paths) {
    const ids = arrays[path]
    const container = getNestedValue(obj, path)

    if (container) {
      const arr = ids.map((id) => container[id])
      setNestedValue(obj, path, arr)
    } else {
      setNestedValue(obj, path, [])
    }
  }
}

function mapFieldsToData(
  fields: Record<string, any>,
  arrays: Record<string, string[]>
) {
  const obj: Record<string, any> = {}
  for (const name in fields) {
    setNestedValue(obj, name, fields[name].ref.current.value)
  }

  normalizeArrays(obj, arrays)

  return obj
}

export default function useForm<S extends ZodRawShape>(
  schema: ZodObject<S>,
  formatErrorMessage: (
    error: ZodIssue,
    value: any,
    name?: string
  ) => string = defaultFormatErrorMessage
) {
  const [fields, setFields] = useState<FieldsMap>({})
  const fieldArrays = useRef<Record<string, string[]>>({})

  function getSchemaForPath(path: string): ZodTypeAny {
    const parts = path.split('.')
    let current: ZodTypeAny = schema

    for (const part of parts) {
      if (current instanceof ZodArray) {
        current = (current as ZodArray<any>).element
        continue
      }

      if (current instanceof ZodObject) {
        const obj = current as ZodObject<any>
        // @ts-ignore
        current = obj.shape[part]
      }
    }

    return current
  }

  function useFieldArray(name: string) {
    const [ids, setIds] = useState<string[]>(() => {
      fieldArrays.current[name] = []
      return []
    })

    function append(id: string = Math.random().toString(36).slice(2)) {
      setIds((ids) => {
        const next = [...ids, id]
        fieldArrays.current[name] = next
        return next
      })
      return id
    }

    function remove(id: string) {
      setIds((ids) => {
        const next = ids.filter((i) => i !== id)
        fieldArrays.current[name] = next
        return next
      })
    }

    return { ids, append, remove }
  }

  function useFormField<T = string, C = ChangeEvent<HTMLInputElement>>(
    name: string,
    options: Omit<
      Options<T>,
      'formatErrorMessage' | 'name' | '_onUpdateValue'
    > = {}
  ) {
    const shape = getSchemaForPath(name)
    // @ts-ignore
    const field = useField<T, C>(shape, {
      ...options,
      name,
      formatErrorMessage,
      _onUpdateValue: (value, dirty) => {
        ref.current = {
          value,
          dirty,
        }
      },
    })

    const ref = useRef<Ref<T>>({
      value: field.value,
      dirty: false,
    })

    function reset() {
      ref.current = {
        value: field.initial.value,
        dirty: false,
      }

      field.reset()
    }

    useEffect(() => {
      setFields((fields: FieldsMap) => ({
        ...fields,
        [name]: {
          ref,
          update: field.update,
          reset,
        },
      }))

      return () =>
        setFields((fields: FieldsMap) => {
          const next = { ...fields }
          delete next[name]
          return next
        })
    }, [])

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

      const data = mapFieldsToData(fields, fieldArrays.current)
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
    useFieldArray,
    handleSubmit,
    formProps,
    isDirty,
    reset,
  }
}
