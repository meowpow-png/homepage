import {useEffect, useState} from 'react'

import type {Navigation} from "./types";

function normalizePathname(pathname: string): string {
    return pathname === '/' ? '/about' : pathname
}

export function useNavigation(): Navigation {
    const [pathname, setPathname] = useState(() =>
        normalizePathname(window.location.pathname),
    )

    function syncPathname(): void {
        const nextPathname = normalizePathname(window.location.pathname)

        if (window.location.pathname === '/') {
            window.history.replaceState(null, '', nextPathname)
        }
        setPathname(nextPathname)
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
    }

    return {
        pathname,
        navigate,
    }
}
