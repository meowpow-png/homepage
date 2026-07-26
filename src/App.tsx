import { useEffect, useState } from 'react'

import { getBlogPost } from './content/blog/posts'
import { AppShell } from './shared/components/AppShell/AppShell'
import { Footer } from './shared/components/Footer/Footer'
import { Navigation } from './shared/components/Navigation/Navigation'
import { About } from './sections/About'
import { Blog } from './sections/Blog'
import { BlogPost } from './sections/BlogPost'
import { NotFound } from './sections/NotFound'
import { Projects } from './sections/Projects'
import { Questions } from './sections/Questions'
import { RouterContext } from './shared/routing'

const routes = {
  '/about': { currentPage: 'about', render: () => <About /> },
  '/projects': { currentPage: 'projects', render: () => <Projects /> },
  '/blog': { currentPage: 'blog', render: () => <Blog /> },
  '/questions': { currentPage: 'questions', render: () => <Questions /> },
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
  const blogPost = pathname.startsWith('/blog/')
      ? getBlogPost(pathname.slice('/blog/'.length))
      : undefined
  const currentPage = route?.currentPage ?? (blogPost ? 'blog' : undefined)

  return (
      <RouterContext.Provider value={{ navigate }}>
        <AppShell
            header={<Navigation currentPage={currentPage} />}
            footer={<Footer />}
        >
          {route ? route.render() : blogPost ? <BlogPost post={blogPost} /> : <NotFound />}
        </AppShell>
      </RouterContext.Provider>
  )
}
