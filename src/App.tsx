import { AppShell } from './shared/components/AppShell/AppShell'
import { Footer } from './shared/components/Footer/Footer'
import { Navigation } from './shared/components/Navigation/Navigation'
import { About } from './sections/About'
import { Blog } from './sections/Blog'
import { Projects } from './sections/Projects'

export function App() {
  const path = window.location.pathname
  const currentPage = path === '/projects' ? 'projects' : path === '/blog' ? 'blog' : 'about'

  return (
    <AppShell
      header={<Navigation currentPage={currentPage} />}
      footer={<Footer />}
    >
      {path === '/projects' ? <Projects /> : path === '/blog' ? <Blog /> : <About />}
    </AppShell>
  )
}
