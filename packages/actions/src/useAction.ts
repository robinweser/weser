import { useState } from 'react'

import { T_ActionResponse } from './types.js'

type State<T> = {
  loading: boolean
  data: T | null
  error: string | null
}

type T_ActionConfig<T> = {
  onSuccess?: (data: T) => void
  onError?: (error: string) => void
}
const initialState = {
  loading: false,
  data: null,
  error: null,
}
export default function useAction<T, P extends Array<any>>(
  action: (...payload: P) => Promise<T_ActionResponse<T>>,
  config: T_ActionConfig<T> = {}
): [State<T>, (...payload: P) => void] {
  const { onSuccess, onError } = config

  const [state, setState] = useState<State<T>>(initialState)

  async function run(...payload: P) {
    setState({
      ...state,
      loading: true,
    })

    const [error, data] = await action(...payload)

    if (error !== null || !data) {
      if (onError) {
        onError(error as string)
      }

      setState({
        ...state,
        error,
        data: null,
        loading: false,
      })
    } else {
      if (onSuccess) {
        onSuccess(data)
      }

      setState({
        ...state,
        error: null,
        data,
        loading: false,
      })
    }
  }

  return [state, run]
}
