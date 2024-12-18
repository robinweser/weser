import useStorage, { Config } from './useStorage'

export default function useSessionStorage<T = any>(
  key: string,
  initialState: T,
  config?: Config<T>
) {
  return useStorage<T>(() => sessionStorage, key, initialState, config)
}
