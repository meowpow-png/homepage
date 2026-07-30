import type { JSX } from 'react'
import { useEffect } from 'react'

import { AppShell, Footer, Navigation } from '@/shared/components'
import { resolveRoute, RouterContext, useNavigation } from '@/shared/routing'
import { SITE_URL } from '@/shared/siteUrl'

import { NotFound } from '@/sections/NotFound'

interface AppProps {
  initialPathname?: string
}

export function App({ initialPathname }: AppProps = {}): JSX.Element {
  const navigation = useNavigation(initialPathname)
  const route = resolveRoute(navigation.pathname)

  useEffect(() => {
    const title = route?.title ?? 'Not Found'
    const description = route?.description ?? 'Page not found.'

    document.title = `${title} · meowpow.dev`
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)

    const canonical = document.querySelector('link[rel="canonical"]')

    // an error page has no canonical version, so drop the tag entirely
    if (!route) {
      canonical?.remove()
      return
    }
    if (canonical) {
      canonical.setAttribute('href', `${SITE_URL}${navigation.pathname}`)
    } else {
      const link = document.createElement('link')
      link.rel = 'canonical'
      link.href = `${SITE_URL}${navigation.pathname}`
      document.head.appendChild(link)
    }
  }, [route, navigation.pathname])

  return (
    <RouterContext.Provider value={navigation}>
      <AppShell header={<Navigation currentPage={route?.currentPage} />} footer={<Footer />}>
        {route ? route.render() : <NotFound />}
      </AppShell>
    </RouterContext.Provider>
  )
}
