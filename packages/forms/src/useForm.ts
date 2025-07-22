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
type ArraysMap = Record<string, string[]>
type ArrayValuesMap = Record<string, Record<string, any>>

export type PathKeys<T extends ZodRawShape> =
  | (keyof T & string)
  | `${keyof T & string}.${string}`

type ArrayKeys<S extends ZodRawShape> = {
  [K in keyof S]: S[K] extends ZodArray<any> ? K : never
}[keyof S]

type ArrayValue<T> = T extends ZodArray<infer U> ? z.infer<U> : never

type ArrayElement<S extends ZodRawShape, K extends ArrayKeys<S>> = S[K] extends ZodArray<infer U>
  ? U
  : never

type ArrayChildKeys<
  S extends ZodRawShape,
  K extends ArrayKeys<S>
> = ArrayElement<S, K> extends ZodObject<infer U> ? PathKeys<U> : never

function setDeepValue(
  obj: Record<string, any>,
  path: string[],
  value: any,
  arrays: ArraysMap
): Record<string, any> {
  if (path.length === 0) {
    return obj
  }

  const [head, ...rest] = path
  const arrayIds = arrays[head]

  if (arrayIds) {
    const [id, ...next] = rest
    const index = arrayIds.indexOf(id)
    const target = Array.isArray(obj[head]) ? obj[head] : []
    const item = setDeepValue(target[index] || {}, next, value, arrays)
    const nextArray = target.map((v: any, i: number) => (i === index ? item : v))
    if (index >= target.length) {
      return {
        ...obj,
        [head]: [...nextArray, ...Array(index - target.length).fill({}), item],
      }
    }
    return { ...obj, [head]: nextArray }
  }

  if (rest.length === 0) {
    return { ...obj, [head]: value }
  }

  return {
    ...obj,
    [head]: setDeepValue(obj[head] || {}, rest, value, arrays),
  }
}

function mapFieldsToData(fields: Record<string, any>, arrays: ArraysMap): Record<string, any> {
  return Object.keys(fields).reduce(
    (acc, name) =>
      setDeepValue(acc, name.split('.'), fields[name].ref.current.value, arrays),
    {}
  )
}

export default function useForm<S extends ZodRawShape>(
  schema: ZodObject<S>,
  formatErrorMessage: (
    error: ZodIssue,
    value: any,
    name?: string
  ) => string = defaultFormatErrorMessage
) {
  const fieldsRef = useRef<FieldsMap>({})
  const arraysRef = useRef<ArraysMap>({})
  const arrayValuesRef = useRef<ArrayValuesMap>({})

  function getSchema(path: string): ZodTypeAny {
    const parts = path.split('.')
    let current: ZodTypeAny = schema

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]

      if (current instanceof ZodObject) {
        current = current.shape[part]
        continue
      }

      if (current instanceof ZodArray) {
        const element: ZodTypeAny = (current as any).element || (current as any)._def.type
        current = element

        if (arraysRef.current[parts[i - 1]]) {
          // skip array id segment
          continue
        }

        if (/^\d+$/.test(part)) {
          continue
        }

        if (current instanceof ZodObject) {
          current = current.shape[part]
        }
      }
    }

    return current
  }

  function getDefaultValue(path: string) {
    const parts = path.split('.')
    for (let i = 0; i < parts.length; i++) {
      const arrName = parts[i]
      const ids = arraysRef.current[arrName]
      if (!ids) continue
      const id = parts[i + 1]
      const rest = parts.slice(i + 2).join('.')
      const value = arrayValuesRef.current[arrName]?.[id]
      if (value && rest) {
        return rest.split('.').reduce((acc, key) => acc?.[key], value)
      }
    }
    return undefined
  }

  function useFormField<T = string, C = ChangeEvent<HTMLInputElement>>(
    name: PathKeys<S>,
    options: Omit<
      Options<T>,
      'formatErrorMessage' | 'name' | '_onUpdateValue'
    > = {}
  ) {
    const shape = getSchema(name)
    const defaultValue = options.value ?? getDefaultValue(name)
    // @ts-ignore
    const field = useField<T, C>(shape, {
      ...options,
      name,
      value: defaultValue,
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
      fieldsRef.current[name] = {
        ref,
        update: field.update,
        reset,
      }

      return () => {
        delete fieldsRef.current[name]
      }
    }, [])

    return {
      ...field,
      reset,
    }
  }

  function useFieldArray<K extends ArrayKeys<S>>(
    name: K,
    initial: ArrayValue<S[K]>[] = []
  ) {
    const [ids, setIds] = useState<string[]>(() => {
      const existing = arraysRef.current[name as string]
      if (existing && existing.length) {
        return [...existing]
      }

      const initialIds = initial.map(() => Math.random().toString(36).slice(2))
      arraysRef.current[name as string] = initialIds
      arrayValuesRef.current[name as string] = initial.reduce<Record<string, any>>(
        (acc, val, idx) => {
          acc[initialIds[idx]] = val
          return acc
        },
        {}
      )
      if (initialIds.length > 0) {
        return initialIds
      }
      const first = Math.random().toString(36).slice(2)
      arraysRef.current[name as string] = [first]
      return [first]
    })

    useEffect(() => {
      arraysRef.current[name as string] = ids
    }, [ids])

    function append(value?: ArrayValue<S[K]>) {
      const id = Math.random().toString(36).slice(2)
      setIds((list) => [...list, id])
      if (value !== undefined) {
        arrayValuesRef.current[name as string] = {
          ...(arrayValuesRef.current[name as string] || {}),
          [id]: value,
        }
      }
    }

    function remove(id: string) {
      setIds((list) => list.filter((item) => item !== id))
      arrayValuesRef.current[name as string] = Object.keys(
        arrayValuesRef.current[name as string] || {}
      ).reduce<Record<string, any>>((acc, key) => {
        if (key !== id) {
          acc[key] = arrayValuesRef.current[name as string][key]
        }
        return acc
      }, {})
      const next: FieldsMap = {}
      for (const key in fieldsRef.current) {
        if (!key.startsWith(`${String(name)}.${id}.`)) {
          next[key] = fieldsRef.current[key]
        }
      }
      fieldsRef.current = next
    }

    const fieldsArray = ids.map((id) => ({
      id,
      useFormField<P extends ArrayChildKeys<S, K>, T = string, C = ChangeEvent<HTMLInputElement>>(
        child: P,
        options?: Omit<Options<T>, 'formatErrorMessage' | 'name' | '_onUpdateValue'>
      ) {
        return useFormField<T, C>(`${String(name)}.${id}.${child}`, options)
      },
    }))

    return { fields: fieldsArray, append, remove }
  }

  function touchFields() {
    for (const name in fieldsRef.current) {
      fieldsRef.current[name].update({ touched: true })
    }
  }

  function reset() {
    for (const name in fieldsRef.current) {
      fieldsRef.current[name].reset()
    }
  }

  function isDirty() {
    for (const name in fieldsRef.current) {
      if (fieldsRef.current[name].ref.current.dirty) {
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

      const data = mapFieldsToData(fieldsRef.current, arraysRef.current)
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
