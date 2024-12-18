'use client'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

type SyntheticStorage<T = any> = {
  getItem: (key: string) => T | Promise<T>
  setItem: (key: string, value: T) => void | Promise<void>
}

export type Config<T> = {
  onHydrated?: (value?: T) => void
  encode?: (value: T) => any
  decode?: (value: any) => T
}

export default function useStorage<T = any>(
  getStorage: () => Storage | SyntheticStorage,
  key: string,
  initialState: T,
  config: Config<T> = {}
): [T, Dispatch<SetStateAction<T>>, boolean] {
  const { onHydrated, encode = JSON.stringify, decode = JSON.parse } = config

  const [isLoading, setLoading] = useState(true)
  // @ts-ignore
  const [state, setState] = useState<T>(initialState)

  useEffect(() => {
    if (!isLoading) {
      return
    }

    const storage = getStorage()

    if (storage) {
      const isAsync = storage.getItem.constructor.name === 'AsyncFunction'

      async function getStorageValue() {
        if (isAsync) {
          return await storage.getItem(key)
        } else {
          return storage.getItem(key)
        }
      }

      async function hydrate() {
        const data = await getStorageValue()

        let parsedValue
        if (data) {
          try {
            parsedValue = decode(data)
            setState(parsedValue)
          } catch (e) {}
        }

        setLoading(false)

        if (onHydrated) {
          onHydrated(parsedValue)
        }
      }

      hydrate()
    } else {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isLoading) {
      const storage = getStorage()

      if (storage) {
        try {
          storage.setItem(key, encode(state))
        } catch (e) {}
      }
    }
  }, [isLoading, state])

  return [state, setState, isLoading]
}
