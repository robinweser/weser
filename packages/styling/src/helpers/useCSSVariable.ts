import { useId } from 'react'

export default function useCSSVariable(): [`--${string}`, string] {
  const id = useId()

  const name = id.replace(/:/g, '_')

  return [`--${name}`, `var(--${name})`]
}
