import { describe, expect, it } from 'vitest'

import { blogPosts } from '@/content/blog'
import { routes, type RoutePath } from '@/shared/routing'

import { readDistFile } from './helpers'

const EMPTY_ROOT = '<div id="root"></div>'

describe('rendered content', () => {
  it.each(Object.keys(routes) as RoutePath[])(
    '%s contains rendered markup, not an empty shell',
    async (path) => {
      const html = await readDistFile(`${path}/index.html`)
      expect(html).not.toContain(EMPTY_ROOT)
    },
  )

  it.each(blogPosts.map((post) => post.metadata.slug))(
    'blog post %s contains rendered markup, not an empty shell',
    async (slug) => {
      const html = await readDistFile(`blog/${slug}/index.html`)
      expect(html).not.toContain(EMPTY_ROOT)
    },
  )
})
