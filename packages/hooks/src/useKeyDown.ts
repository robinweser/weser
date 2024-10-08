import { RefObject, useEffect } from 'react'

type Options = {
  target?: RefObject<HTMLElement>
  active?: boolean
}
export default function useKeyDown(
  keyCode: string | Array<string>,
  callback: (e: KeyboardEvent) => void,
  options: Options = {}
) {
  const { active = true, target } = options
  const keyCodes = ([] as Array<string>).concat(keyCode)

  useEffect(() => {
    if (!active || target === null || target?.current === null) {
      return
    }

    const hasRef = target && target.current
    const element = hasRef ? target.current : document

    if (element) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (
          keyCodes.includes(e.code) &&
          (!hasRef || (hasRef && document.activeElement === element))
        ) {
          callback(e)
        }
      }

      element.addEventListener(
        'keydown',
        handleKeyDown as unknown as EventListener
      )
      return () =>
        element.removeEventListener(
          'keydown',
          handleKeyDown as unknown as EventListener
        )
    }
  }, [target, callback, active, keyCode])
}
