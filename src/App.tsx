import { AppShell } from './shared/components/AppShell/AppShell'
import { Footer } from './shared/components/Footer/Footer'
import { Navigation } from './shared/components/Navigation/Navigation'

export function App() {
  return <AppShell header={<Navigation />} footer={<Footer />} />
}
