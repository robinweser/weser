import { Dispatch, SetStateAction, useOptimistic } from 'react'

type FunctionalSetState<T> = (previousState: T) => T

export default function useOptimisticState<T>(
  initialState: T
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useOptimistic(
    initialState,
    (_: T, update: T) => update
  )

  function setFunctionalState(newState: T | FunctionalSetState<T>) {
    if (newState instanceof Function) {
      return setState(newState(state))
    }

    return setState(newState)
  }

  return [state, setFunctionalState]
}
