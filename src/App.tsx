import { AppShell } from './shared/components/AppShell/AppShell'
import { Footer } from './shared/components/Footer/Footer'
import { Navigation } from './shared/components/Navigation/Navigation'
import { About } from './sections/About'

export function App() {
  return (
    <AppShell header={<Navigation />} footer={<Footer />}>
      <About />
    </AppShell>
  )
}
