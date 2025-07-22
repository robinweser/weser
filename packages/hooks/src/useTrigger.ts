import { RefObject, useEffect, useRef, useState } from 'react'

type Props<T> = {
  defaultVisible?: boolean
  getTrigger?: () => T | null
}

export default function useTrigger<T extends HTMLElement = HTMLButtonElement>({
  defaultVisible = false,
  getTrigger,
}: Props<T> = {}): [boolean, (visible: boolean) => void, RefObject<T>] {
  const triggerRef = useRef<T>(null)
  const [isVisible, _setVisible] = useState<boolean>(false)

  function getTriggerElement() {
    if (getTrigger) {
      return getTrigger()
    }

    return triggerRef.current
  }

  function setVisible(visible: boolean) {
    if (isVisible !== visible) {
      _setVisible(visible)

      if (!visible) {
        const trigger = getTriggerElement()

        if (trigger) {
          trigger.focus()
        }
      }
    }
  }

  useEffect(() => _setVisible(defaultVisible), [defaultVisible])

  return [isVisible, setVisible, triggerRef]
}
