import { useState, useEffect } from 'react'

function debounce(handler: () => void, delay: number) {
  let timeout: any

  return () => {
    clearTimeout(timeout)
    timeout = setTimeout(handler, delay)
  }
}

export default function useBreakpoint(breakpoint: string, delay: number = 250) {
  const [isMatching, setMatching] = useState(false)

  useEffect(() => {
    const handleResize = debounce(
      () => setMatching(window.matchMedia(breakpoint).matches),
      delay
    )

    // initial check
    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return isMatching
}
