import { useContext } from 'react'

import { RouterContext } from './RouterContext'
import type { RouterContextValue } from './types'

export function useRouter(): RouterContextValue {
  const router = useContext(RouterContext)

  if (!router) {
    throw new Error('useRouter must be used within RouterContext')
  }
  return router
}
