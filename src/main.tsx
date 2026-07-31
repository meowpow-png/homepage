import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'

import '@/shared/styles/tokens.css'
import '@/shared/styles/global.css'
import '@/shared/styles/typography.css'

import { App } from './App'

hydrateRoot(
  document.getElementById('root')!,
  <StrictMode>
    <App />
  </StrictMode>,
)
