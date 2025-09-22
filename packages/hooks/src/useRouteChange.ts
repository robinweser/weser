import { useEffect } from 'react'

export default function useRouteChange(
  onRouteChange: (path: string) => void,
  pathname?: string
) {
  useEffect(() => {
    if (pathname) {
      onRouteChange(pathname)
    }
  }, [pathname])

  // track clicks on links with the current path
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement
      const anchor = getContainingAnchor(e.target)

      if (
        (target.tagName === 'A' && target.href === pathname) ||
        (anchor !== null && anchor?.pathname === pathname)
      ) {
        onRouteChange(pathname)
      }
    }

    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [pathname])
}

function getContainingAnchor(
  node: EventTarget | Node | null
): HTMLAnchorElement | null {
  if (!node || !(node instanceof Node)) return null

  if (node.nodeType === Node.ELEMENT_NODE) {
    return (node as Element).closest('a') as HTMLAnchorElement | null
  }

  // For text/other nodes, start at the nearest Element ancestor
  const parent =
    (node.parentElement as Element | null) ||
    (node.parentNode as Element | null)

  return parent?.closest('a') as HTMLAnchorElement | null
}
