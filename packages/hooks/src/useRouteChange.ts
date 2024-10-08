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

      if (target.tagName === 'A' && target.href === pathname) {
        onRouteChange(pathname)
      }
    }

    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [])
}
