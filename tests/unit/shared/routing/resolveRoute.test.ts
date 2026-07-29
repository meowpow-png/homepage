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

  it('returns the static blog route for the blog index path', () => {
    expect(resolveRoute('/blog')).toBe(routes['/blog'])
  })

  it('returns a blog route for a known post slug', () => {
    const route = resolveRoute('/blog/telekom-assignment-overview')

    expect(route?.currentPage).toBe('blog')
    expect(route && isValidElement(route.render())).toBe(true)
  })

  it('returns undefined for an unknown post slug', () => {
    expect(resolveRoute('/blog/unknown-slug')).toBeUndefined()
  })
})

describe('routes', () => {
  it.each(Object.keys(routes) as RoutePath[])('%s renders a valid element', (path) => {
    expect(isValidElement(routes[path].render())).toBe(true)
  })
})
