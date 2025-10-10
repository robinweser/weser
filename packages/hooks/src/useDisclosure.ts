import { useState, useEffect, useId } from 'react'

export default function useDisclosure(defaultExpanded: boolean = false) {
  const [isExpanded, setExpanded] = useState(defaultExpanded)
  const id = useId()

  useEffect(() => setExpanded(defaultExpanded), [defaultExpanded])

  const toggle = () => setExpanded((isExpanded) => !isExpanded)

  const toggleProps = {
    id: id + '-toggle',
    onClick: toggle,
    type: 'button',
    'aria-expanded': isExpanded,
    'aria-controls': id + '-content',
  } as const

  const contentProps = {
    id: id + '-content',
    'aria-hidden': !isExpanded,
    'aria-labelledby': id + '-toggle',
  } as const

  return {
    toggleProps,
    contentProps,
    isExpanded,
    toggle,
  }
}
