import { isValidElement } from 'react'
import { describe, expect, it } from 'vitest'

import { resolveRoute, routes } from '@/shared/routing'
import type { RoutePath } from '@/shared/routing'

describe('resolveRoute', () => {
  it('returns the route for a known path', () => {
    expect(resolveRoute('/about')).toBe(routes['/about'])
  })

  it('returns undefined for an unknown path', () => {
    expect(resolveRoute('/unknown')).toBeUndefined()
  })
})

describe('routes', () => {
  it.each(Object.keys(routes) as RoutePath[])('%s renders a valid element', (path) => {
    expect(isValidElement(routes[path].render())).toBe(true)
  })
})
