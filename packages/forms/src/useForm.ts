import { useRef, FormEvent, ChangeEvent, useState } from 'react'
import {
  z,
  ZodObject,
  ZodError,
  ZodRawShape,
  ZodType,
  uuid,
  ZodArray,
} from 'zod'
import { $ZodIssue } from '@zod/core'

import { Options } from './types.js'
import defaultFormatErrorMessage from './defaultFormatErrorMessage.js'
import useField from './useField.js'

// Brand used to type array row identifiers so we can restrict path segments
type FieldArrayId = string & { __weserFieldArrayIdBrand: 'FieldArrayId' }

type PathsForShape<Shape extends ZodRawShape> = {
  [K in keyof Shape & string]: Shape[K] extends ZodObject<infer InnerShape>
    ? `${K}` | `${K}.${PathsForShape<InnerShape>}`
    : Shape[K] extends ZodArray<infer Elem>
      ? Elem extends ZodObject<infer ElemInner>
        ?
            | `${K}`
            | `${K}.${FieldArrayId}`
            | `${K}.${FieldArrayId}.${PathsForShape<ElemInner>}`
        : `${K}` | `${K}.${FieldArrayId}`
      : `${K}`
}[keyof Shape & string]

type FieldsMap = Record<string, ReturnType<typeof useField<any, any>>>

// TODO: inflate data with array values
function mapFieldsToData(fields: Record<string, any>): Record<string, any> {
  const obj: Record<string, any> = {}

  for (const name in fields) {
    obj[name] = fields[name].value
  }

  return obj
}

export default function useForm<S extends ZodRawShape>(
  schema: ZodObject<S>,
  formatErrorMessage: (
    error: $ZodIssue,
    value: any,
    name?: string
  ) => string = defaultFormatErrorMessage
) {
  const fields = useRef<FieldsMap>({})

  type ArrayKeys = {
    [K in keyof S]: S[K] extends ZodArray<any> ? K : never
  }[keyof S]

  type ValidFieldPath = PathsForShape<S>

  function useFormField<T = string, C = ChangeEvent<HTMLInputElement>>(
    _name: ValidFieldPath,
    options: Omit<
      Options<T>,
      'formatErrorMessage' | 'name' | '_onUpdateValue'
    > = {}
  ) {
    const name = String(_name)
    const shape = resolveTypeForPath(schema, name)
    const stored = fields.current[name]

    const field = useField<T, C>(shape, {
      ...options,
      name,
      formatErrorMessage,
      // internals
      _storedField: stored,
      _onInit: (data) => {
        fields.current[name] = {
          ...field,
          ...data,
        }
      },
      _onUpdate: (data) => {
        fields.current[name] = {
          ...fields.current[name],
          ...data,
        }
      },
    })

    return field
  }

  type ArrayValue<K extends ArrayKeys> = z.infer<(typeof schema.shape)[K]>

  type FieldRow<K extends ArrayKeys> = {
    id: FieldArrayId
    defaultValue?: ArrayValue<K>
  }

  function useFieldArray<K extends ArrayKeys>(
    name: K,
    value: ArrayValue<K>
  ): [
    Array<FieldRow<K>>,
    { append: () => void; remove: (id: FieldArrayId) => void },
  ] {
    const [rows, setRows] = useState<Array<FieldRow<K>>>([])

    // TODO: add array value types
    function append(defaultValue?: any) {
      const id = uuid() as unknown as FieldArrayId

      setRows((rows) => [...rows, { id, defaultValue }])
    }

    function remove(id: FieldArrayId) {
      setRows(rows.filter((row) => row.id !== id))

      for (const _name in fields.current) {
        if (_name.includes(id)) {
          delete fields.current[_name]
        }
      }
    }

    return [rows, { append, remove }]
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

  function checkDirty() {
    for (const name in fields.current) {
      if (fields.current[name].dirty) {
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

      const data = mapFieldsToData(fields.current)
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

  return {
    useFormField,
    useFieldArray,
    handleSubmit,
    checkDirty,
    reset,
  }
}

function resolveTypeForPath<S extends ZodRawShape>(
  schema: ZodObject<S>,
  path: string
): ZodType<any, any> {
  const parts = path.split('.')
  let current: ZodType<any, any> = schema as unknown as ZodType<any, any>

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]

    if (current instanceof ZodObject) {
      const shape: Record<string, ZodType<any, any>> = (
        current as unknown as ZodObject<any>
      ).shape as any
      const next = shape[part]
      if (!next) {
        return z.any()
      }
      current = next
      continue
    }

    if (current instanceof ZodArray) {
      const element: ZodType<any, any> = (current as any)._def.type
      current = element

      if (i < parts.length - 1) {
        i += 1
      } else {
        return current
      }

      continue
    }

    return current
  }

  return current
}
