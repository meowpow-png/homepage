import { startTransition, useEffect, useState } from 'react'

import type { Navigation } from './types'

export function normalizePathname(pathname: string): string {
  const trimmed = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  return trimmed === '/' ? '/about' : trimmed
}

export function useNavigation(initialPathname?: string): Navigation {
  const [pathname, setPathname] = useState(() =>
    normalizePathname(initialPathname ?? window.location.pathname),
  )

  function syncPathname(): void {
    const nextPathname = normalizePathname(window.location.pathname)

    if (window.location.pathname === '/') {
      window.history.replaceState(null, '', nextPathname)
    }
    // a transition keeps the current section on screen until the next one's
    // lazy import resolves, instead of unmounting it for a blank Suspense fallback
    startTransition(() => {
      setPathname(nextPathname)
    })
  }

  useEffect(() => {
    syncPathname()
    window.addEventListener('popstate', syncPathname)

    return () => window.removeEventListener('popstate', syncPathname)
  }, [])

  function navigate(nextPathname: string): void {
    if (nextPathname === pathname) {
      return
    }
    window.history.pushState(null, '', nextPathname)
    syncPathname()
    window.scrollTo(0, 0)
  }

  return {
    pathname,
    navigate,
  }
}
