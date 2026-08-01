import type { JSX } from 'react'
import { Suspense, useEffect } from 'react'

import { AppShell, Footer, Navigation } from '@/shared/components'
import { OG_IMAGE_URL } from '@/shared/ogImageUrl'
import {
  prefetchImages,
  prefetchSections,
  resolveRoute,
  RouterContext,
  useNavigation,
} from '@/shared/routing'
import { SITE_URL } from '@/shared/siteUrl'

import { NotFound } from '@/sections/NotFound'

interface AppProps {
  initialPathname?: string
}

function setMetaContent(selector: string, content: string): void {
  document.querySelector(selector)?.setAttribute('content', content)
}

export function App({ initialPathname }: AppProps = {}): JSX.Element {
  const navigation = useNavigation(initialPathname)
  const route = resolveRoute(navigation.pathname)

  // warms cache for every section and image once, so navigating
  // to one later resolves instantly instead of fetching it on click
  useEffect(() => {
    prefetchSections()
    prefetchImages()
  }, [])

  // keep in sync with prerender.js's injectHead: same title/description/canonical/
  // image rules must apply client-side (this effect) and server-side
  useEffect(() => {
    const title = route?.title ?? 'Not Found'
    const description = route?.description ?? 'Page not found.'
    const imageUrl = `${SITE_URL}${OG_IMAGE_URL}`

    document.title = `${title} · meowpow.dev`
    setMetaContent('meta[name="description"]', description)
    setMetaContent('meta[property="og:title"]', title)
    setMetaContent('meta[property="og:description"]', description)
    setMetaContent('meta[property="og:image"]', imageUrl)
    setMetaContent('meta[name="twitter:title"]', title)
    setMetaContent('meta[name="twitter:description"]', description)
    setMetaContent('meta[name="twitter:image"]', imageUrl)

    const canonical = document.querySelector('link[rel="canonical"]')
    const ogUrl = document.querySelector('meta[property="og:url"]')

    // an error page has no canonical version, so drop both tags entirely
    if (!route) {
      canonical?.remove()
      ogUrl?.remove()
      return
    }
    const url = `${SITE_URL}${navigation.pathname}`

    if (canonical) {
      canonical.setAttribute('href', url)
    } else {
      const link = document.createElement('link')
      link.rel = 'canonical'
      link.href = url
      document.head.appendChild(link)
    }
    if (ogUrl) {
      ogUrl.setAttribute('content', url)
    } else {
      const meta = document.createElement('meta')
      meta.setAttribute('property', 'og:url')
      meta.setAttribute('content', url)
      document.head.appendChild(meta)
    }
  }, [route, navigation.pathname])

  return (
    <RouterContext.Provider value={navigation}>
      <AppShell header={<Navigation currentPage={route?.currentPage} />} footer={<Footer />}>
        {route ? <Suspense fallback={null}>{route.render()}</Suspense> : <NotFound />}
      </AppShell>
    </RouterContext.Provider>
  )
}
