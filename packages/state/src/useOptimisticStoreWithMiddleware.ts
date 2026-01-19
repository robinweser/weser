// @ts-ignore
import { useOptimistic } from 'react'

import useStoreFactory, { T_Middleware } from './useStoreFactory'

export default function useOptimisticStoreWithMiddleware<Model>(
  middleware: Array<T_Middleware<Model>> = []
) {
  function useState(initialState: Model): [Model, (newState: Model) => void] {
    const [state, setState] = useOptimistic(
      initialState,
      (_: Model, update: Model) => update
    )

    function setFunctionalState(newState: Model) {
      if (typeof newState === 'function') {
        return setState(newState(state))
      }

      return setState(newState)
    }

    return [state, setFunctionalState]
  }

  return useStoreFactory<Model>(useState)(middleware)
}
