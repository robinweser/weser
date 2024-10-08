import { RefObject, useEffect } from 'react'

export default function useClickAway(
  ref: RefObject<HTMLElement | null>,
  callback: () => void,
  active: boolean = true
) {
  useEffect(() => {
    const onClickAway = (e: Event) => {
      if (active && ref.current) {
        const isClickOnInner = ref.current.contains(e.target as Node)

        if (!isClickOnInner) {
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
  }, [ref, active, callback])
}
