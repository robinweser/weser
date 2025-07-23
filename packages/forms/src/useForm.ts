import { useEffect, useRef, useState, FormEvent, ChangeEvent } from 'react'
import {
  z,
  ZodObject,
  ZodError,
  ZodRawShape,
  ZodIssue,
  ZodTypeAny,
  ZodArray,
} from 'zod'

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

type ArraysMap = Record<string, string[]>

function getSchemaForPath(schema: ZodTypeAny, path: string[]): ZodTypeAny {
  if (path.length === 0) {
    return schema
  }

  const [segment, ...rest] = path

  if (schema instanceof ZodObject) {
    const next = (schema.shape as any)[segment]
    return getSchemaForPath(next, rest)
  }

  if (schema instanceof ZodArray) {
    // Skip id segment
    return getSchemaForPath((schema as any).element, rest.slice(1))
  }

  return schema
}

function setNestedValue(obj: Record<string, any>, path: string[], value: any) {
  let ref = obj
  for (let i = 0; i < path.length - 1; i++) {
    const segment = path[i]
    if (!(segment in ref)) {
      ref[segment] = {}
    }
    ref = ref[segment]
  }
  ref[path[path.length - 1]] = value
}

function normalizeArrays(obj: any, arrays: ArraysMap, path: string[] = []): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  const key = path.join('.')
  if (arrays[key]) {
    return arrays[key].map((id) => normalizeArrays(obj[id], arrays, [...path, id]))
  }

  const res: Record<string, any> = {}
  for (const k in obj) {
    res[k] = normalizeArrays(obj[k], arrays, [...path, k])
  }

  return res
}

function mapFieldsToData(fields: FieldsMap, arrays: ArraysMap) {
  const obj: Record<string, any> = {}
  for (const name in fields) {
    setNestedValue(obj, name.split('.'), fields[name].ref.current.value)
  }
  return normalizeArrays(obj, arrays)
}

export default function useForm<S extends ZodRawShape>(
  schema: ZodObject<S>,
  formatErrorMessage: (
    error: ZodIssue,
    value: any,
    name?: string
  ) => string = defaultFormatErrorMessage
) {
  const fields = useRef<FieldsMap>({})
  const arrays = useRef<ArraysMap>({})

  function useFormField<T = string, C = ChangeEvent<HTMLInputElement>>(
    name: string,
    options: Omit<
      Options<T>,
      'formatErrorMessage' | 'name' | '_onUpdateValue' | '_storedField'
    > = {}
  ) {
    const shape = getSchemaForPath(schema, name.split('.')) as ZodTypeAny
    const stored = fields.current[name]?.ref.current as Ref<T> | undefined
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

    useEffect(() => {
      if (!fields.current[name]) {
        fields.current[name] = { ref, update: field.update, reset }
      }
      return () => {
        delete fields.current[name]
      }
    }, [])

    return {
      ...field,
      reset,
    }
  }

  function removeFieldsForPrefix(prefix: string) {
    Object.keys(fields.current).forEach((key) => {
      if (key.startsWith(prefix)) {
        delete fields.current[key]
      }
    })
  }

  function useFieldArray(name: string) {
    const [ids, setIds] = useState<string[]>(() => arrays.current[name] ?? [])

    useEffect(() => {
      arrays.current[name] = ids
    }, [ids, name])

    function append() {
      const id = Math.random().toString(36).slice(2, 9)
      setIds((i) => [...i, id])
      return id
    }

    function remove(id: string) {
      setIds((i) => i.filter((x) => x !== id))
      removeFieldsForPrefix(`${name}.${id}`)
    }

    return { ids, append, remove }
  }

  function touchFields() {
    for (const name in fields.current) {
      fields.current[name].update({ touched: true })
    }
  }

  function reset() {
    for (const name in fields.current) {
      fields.current[name].reset()
    }
  }

  function isDirty() {
    for (const name in fields.current) {
      if (fields.current[name].ref.current.dirty) {
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

      const data = mapFieldsToData(fields.current, arrays.current)
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
