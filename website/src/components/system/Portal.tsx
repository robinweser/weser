'use client'
import { ReactNode, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  children: ReactNode
  container?: HTMLElement
}
export default function Portal({ children, container }: Props): ReactNode {
  const [isMounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!isMounted) {
    return null
  }

  // @ts-ignore
  return createPortal(children, container || document.body)
}
