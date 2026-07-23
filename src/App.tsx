import { AppShell } from './shared/components/AppShell/AppShell'
import { Navigation } from './shared/components/Navigation/Navigation'

export function App() {
  return <AppShell header={<Navigation />} />
}
