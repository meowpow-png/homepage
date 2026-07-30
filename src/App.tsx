import type { JSX } from 'react'

import { AppShell, Footer, Navigation } from '@/shared/components'
import { resolveRoute, RouterContext, useNavigation } from '@/shared/routing'

import { NotFound } from '@/sections/NotFound'

interface AppProps {
  initialPathname?: string
}

export function App({ initialPathname }: AppProps = {}): JSX.Element {
  const navigation = useNavigation(initialPathname)
  const route = resolveRoute(navigation.pathname)

  return (
    <RouterContext.Provider value={navigation}>
      <AppShell header={<Navigation currentPage={route?.currentPage} />} footer={<Footer />}>
        {route ? route.render() : <NotFound />}
      </AppShell>
    </RouterContext.Provider>
  )
}
