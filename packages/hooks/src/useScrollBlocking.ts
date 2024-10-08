import { useEffect } from 'react'

let scrollTop: number
function blockScrolling(scrollElement: HTMLElement) {
  scrollTop = window.scrollY

  scrollElement.style.overflow = 'hidden'
  scrollElement.style.position = 'fixed'
  scrollElement.style.width = '100%'
  scrollElement.style.top = -scrollTop + 'px'
}

function enableScrolling(scrollElement: HTMLElement) {
  scrollElement.style.removeProperty('position')
  scrollElement.style.removeProperty('overflow')
  scrollElement.style.removeProperty('top')
  scrollElement.style.removeProperty('width')

  window.scrollTo(0, scrollTop)
}

function toggleScrolling(isBlocked: boolean) {
  const scrollElement = document.scrollingElement as HTMLElement

  if (isBlocked) {
    blockScrolling(scrollElement)
  } else {
    enableScrolling(scrollElement)
  }
}

export default function useScrollBlocking(active: boolean) {
  useEffect(() => toggleScrolling(active), [active])
}
