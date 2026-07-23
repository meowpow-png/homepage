import { AppShell } from './shared/components/AppShell/AppShell'
import { Footer } from './shared/components/Footer/Footer'
import { Navigation } from './shared/components/Navigation/Navigation'
import { About } from './sections/About'
import { Projects } from './sections/Projects'

export function App() {
  const isProjectsPage = window.location.pathname === '/projects'

  return (
    <AppShell
      header={<Navigation currentPage={isProjectsPage ? 'projects' : 'about'} />}
      footer={<Footer />}
    >
      {isProjectsPage ? <Projects /> : <About />}
    </AppShell>
  )
}
