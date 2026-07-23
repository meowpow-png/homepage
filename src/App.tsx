import { useEffect, useState } from 'react'

import { AppShell } from './shared/components/AppShell/AppShell'
import { Footer } from './shared/components/Footer/Footer'
import { Navigation } from './shared/components/Navigation/Navigation'
import { About } from './sections/About'
import { Blog } from './sections/Blog'
import { NotFound } from './sections/NotFound'
import { Projects } from './sections/Projects'
import { Questions } from './sections/Questions'

const routes = {
  '/about': { currentPage: 'about', page: About },
  '/projects': { currentPage: 'projects', page: Projects },
  '/blog': { currentPage: 'blog', page: Blog },
  '/questions': { currentPage: 'questions', page: Questions },
} as const

function getPathname(pathname: string) {
  return pathname === '/' ? '/about' : pathname
}

export function App() {
  const [pathname, setPathname] = useState(() => getPathname(window.location.pathname))

  useEffect(() => {
    function syncPathname() {
      const nextPathname = getPathname(window.location.pathname)

      if (window.location.pathname === '/') {
        window.history.replaceState(null, '', nextPathname)
      }
      setPathname(nextPathname)
    }

    syncPathname()
    window.addEventListener('popstate', syncPathname)

    return () => window.removeEventListener('popstate', syncPathname)
  }, [])

  function navigate(nextPathname: string) {
    if (nextPathname === pathname) {
      return
    }
    window.history.pushState(null, '', nextPathname)
    setPathname(nextPathname)
  }

  const route = routes[pathname as keyof typeof routes]
  const Page = route?.page ?? NotFound

  return (
    <AppShell
      header={<Navigation currentPage={route?.currentPage} onNavigate={navigate} />}
      footer={<Footer />}
    >
      <Page />
    </AppShell>
  )
}
