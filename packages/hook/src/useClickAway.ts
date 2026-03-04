import { useEffect, type RefObject } from 'react'

export default function useClickAway(
  ref: RefObject<HTMLElement | null>,
  callback: () => void,
  active = true,
  ignoreRefs?: RefObject<HTMLElement | null>[]
) {
  useEffect(() => {
    const onClickAway = (e: MouseEvent | TouchEvent) => {
      if (active && ref.current) {
        const target = e.target as Node
        const isClickOnInner = ref.current.contains(target)
        const isClickOnIgnored =
          ignoreRefs?.some((r) => r.current?.contains(target)) ?? false

        if (!isClickOnInner && !isClickOnIgnored) {
          setTimeout(callback, 0)
        }
      }
    }
    document.addEventListener('mousedown', onClickAway)
    document.addEventListener('touchstart', onClickAway)
    return () => {
      document.removeEventListener('mousedown', onClickAway)
      document.removeEventListener('touchstart', onClickAway)
    }
  }, [ref, active, callback, ignoreRefs])
}
