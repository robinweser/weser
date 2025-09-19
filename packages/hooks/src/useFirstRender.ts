import { useRef } from 'react'

export default function useFirstRender() {
  const ref = useRef(true)

  if (ref.current === true) {
    ref.current = false
    return true
  }

  return ref.current
}
