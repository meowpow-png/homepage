import { describe, expect, it } from 'vitest'

import { blogPosts } from '@/content/blog'
import { routes, type RoutePath } from '@/shared/routing'

import { distFileExists } from './helpers'

describe('prerendered route files', () => {
  it.each(Object.keys(routes) as RoutePath[])('writes an index.html for %s', async (path) => {
    expect(await distFileExists(`${path}/index.html`)).toBe(true)
  })

  it.each(blogPosts.map((post) => post.metadata.slug))(
    'writes an index.html for blog post %s',
    async (slug) => {
      expect(await distFileExists(`blog/${slug}/index.html`)).toBe(true)
    },
  )

  it('writes the root index.html', async () => {
    expect(await distFileExists('index.html')).toBe(true)
  })

  it('writes 404.html', async () => {
    expect(await distFileExists('404.html')).toBe(true)
  })
})
