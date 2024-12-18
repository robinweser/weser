import useStorage, { Config } from './useStorage'

export default function useLocalStorage<T = any>(
  key: string,
  initialState: T,
  config?: Config<T>
) {
  return useStorage<T>(() => localStorage, key, initialState, config)
}
