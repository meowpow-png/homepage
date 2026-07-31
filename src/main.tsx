import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'

import '@/shared/styles/tokens.css'
import '@/shared/styles/global.css'
import '@/shared/styles/typography.css'

import { App } from './App'

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// do not hydrate in dev (no prerendered markup)
if (import.meta.env.DEV) {
  createRoot(root).render(app)
} else {
  hydrateRoot(root, app)
}
