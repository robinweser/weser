import { useEffect } from 'react'

type StoreContext = Record<string, any>

export type T_MiddlewareContext = {
  action: string
  payload: any
  prevState: any
}

export type T_Middleware<T = any> = {
  middleware: (state: T, context: T_MiddlewareContext) => any
  effect?: (setState: any) => void
}

export type T_ResolvedActions<Actions, Model> = {
  [Property in keyof Actions]: Actions[Property] extends (
    state: Model,
    ...payload: infer Payload
  ) => any
    ? (...payload: Payload) => void
    : never
}

export type T_Effect<Actions, Model> = (
  actions: T_ResolvedActions<Actions, Model>
) => void
export type T_ActionReturn<Actions, Model> = [Model, T_Effect<Actions, Model>?]

type UseState<T> = (initialState: T) => [T, any]

export default function useStoreFactory<T>(useState: UseState<T>) {
  return function useStoreWithMiddleware(
    middleware: Array<T_Middleware<T>> = []
  ) {
    return function useStore<Model extends T, Actions, Context = StoreContext>(
      actions: Actions & Record<string, (state: Model, ...payload: any) => any>,
      initialState: Model,
      context?: Context
    ): [Model, T_ResolvedActions<Actions, Model>] {
      const [state, setState] = useState(initialState)

      useEffect(
        () => middleware.forEach(({ effect }) => effect && effect(setState)),
        []
      )

      type ActionName = keyof Actions
      const actionNames = Object.keys(actions) as Array<ActionName>

      const resolvedActions = actionNames.reduce(
        (resolved: T_ResolvedActions<Actions, Model>, name: ActionName) => {
          const fn = (...payload: any) => {
            const action = actions[name] as any

            setState((prevState: Model) => {
              const result = action(prevState, ...payload)

              // safety checks for a more convenient DX
              if (!Array.isArray(result)) {
                throw Error(
                  `Wrong format returned from action ("${name.toString()}"). Expected a tuple of [newState, effect], but got ${typeof result}. Make sure to wrap your state with an additional array. See https://stack.weser.io/state/concepts/action`
                )
              }

              const [newState, effect, ...rest] = result

              // safety checks for a more convenient DX
              if (rest.length > 0) {
                throw Error(
                  `Too many values return from an action ("${name.toString()}"). Expected a tuple of [newState, effect]. If your state is an array, make sure to wrap it with an additional array when you return it. See https://stack.weser.io/state/concepts/action`
                )
              }

              if (effect && typeof effect === 'function') {
                effect(resolvedActions, context)
              }

              return middleware.reduce(
                (newState, { middleware }) =>
                  middleware(newState, {
                    action: name.toString(),
                    payload,
                    prevState,
                  }),
                newState
              )
            })
          }

          resolved[name] = fn as any

          return resolved
        },
        {} as T_ResolvedActions<Actions, Model>
      )

      return [state as Model, resolvedActions]
    }
  }
}
