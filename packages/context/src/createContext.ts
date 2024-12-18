'use client'
import {
  ComponentType,
  PropsWithChildren,
  createContext as _createContext,
  useContext as _useContext,
  createElement,
} from 'react'

type Nullable<T> = T | null
type ContextProps<T> = PropsWithChildren<{
  value: T
}>
export default function createContext<T>(
  defaultValue: Nullable<T>,
  name: string = ''
): [() => T, ComponentType<ContextProps<T>>] {
  const Context = _createContext<Nullable<T>>(defaultValue)

  function ContextProvider({ value, children }: ContextProps<T>) {
    return createElement(Context.Provider, { value }, children)
  }

  function useContext() {
    const context = _useContext(Context)

    if (!context) {
      throw new Error(
        `Trying to use ${name ? name + ' ' : ''}context without a provider.`
      )
    }

    return context
  }

  return [useContext, ContextProvider]
}
