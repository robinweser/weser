import { RefObject, useEffect } from 'react'

import useKeyDown from './useKeyDown.js'

const focusableSelector = `:is(
  a[href], 
  area[href], 
  input:not([disabled]), 
  select:not([disabled]), 
  textarea:not([disabled]), 
  button:not([disabled]), 
  [tabindex]:not([tabindex="-1"]), 
  [contenteditable]
)`

type Config = {
  visible?: boolean
  autoFocus?: boolean
}
export default function useFocusTrap(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
  config: Config = {}
) {
  const { visible, autoFocus = true } = config

  useKeyDown(
    'Tab',
    (e) => {
      const element = ref.current

      if (!active || !element) {
        return
      }

      const focusables = [
        ...element.querySelectorAll(focusableSelector),
      ].filter((el) =>
        el.hasAttribute('tabindex')
          ? el.getAttribute('tabindex') !== '-1'
          : true
      )

      const firstFocusable = focusables[0]
      const lastFocusable = focusables[focusables.length - 1]

      const activeElement = document.activeElement

      let nextElement
      if (activeElement && focusables.includes(activeElement)) {
        const index = focusables.indexOf(activeElement)

        if (e.shiftKey) {
          if (index === 0) {
            nextElement = lastFocusable
          }
        } else {
          if (index === focusables.length - 1) {
            nextElement = firstFocusable
          }
        }
      } else {
        if (e.shiftKey) {
          nextElement = lastFocusable
        } else {
          nextElement = firstFocusable
        }
      }
      if (nextElement) {
        ;(nextElement as HTMLElement).focus()
        e.preventDefault()
      }
    },
    {
      active,
    }
  )

  useEffect(() => {
    const element = ref.current

    if (!autoFocus || !visible || !element) {
      return
    }

    const autoFocusElement = element.querySelector(
      '[data-autofocus="true"]' + focusableSelector
    )

    if (autoFocusElement) {
      // @ts-ignore
      autoFocusElement.focus()
      return
    }

    const nodeList = element.querySelectorAll(focusableSelector)
    const elements = Array.from(nodeList)

    const focusableElements = elements.filter(
      (element) =>
        !element.hasAttribute('tabindex') ||
        element.getAttribute('tabindex') === '0'
    )

    // 1. focus the first focusable
    // @ts-ignore, TODO: fix typing
    focusableElements[0]?.focus()
  }, [visible, ref, autoFocus])
}
