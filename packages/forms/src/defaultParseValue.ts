import { ChangeEvent } from 'react'

export default function defaultParseValue<T>(e: ChangeEvent<HTMLInputElement>) {
  return e.target.value as T
}
