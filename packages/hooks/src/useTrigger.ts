import { RefObject, useEffect, useRef, useState } from 'react'

type Props = {
  defaultVisible?: boolean
  getTrigger?: () => HTMLElement | null
}

export default function useTrigger({
  defaultVisible = false,
  getTrigger,
}: Props = {}): [boolean, (visible: boolean) => void, RefObject<HTMLElement>] {
  const triggerRef = useRef<HTMLElement>(null)
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
