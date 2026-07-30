import { describe, expect, it } from 'vitest'

import { blogPosts } from '@/content/blog'
import { routes, type RoutePath } from '@/shared/routing'

import { escapeHtml } from '../../scripts/prerender.js'
import { readDistFile } from './helpers'

describe('page titles and descriptions', () => {
  it.each(Object.keys(routes) as RoutePath[])(
    '%s has the routing title and description',
    async (path) => {
      const html = await readDistFile(`${path}/index.html`)
      const { title, description } = routes[path]

      expect(html).toContain(`<title>${escapeHtml(title)} · meowpow.dev</title>`)
      expect(html).toContain(`<meta name="description" content="${escapeHtml(description)}" />`)
    },
  )

  it.each(blogPosts.map((post) => post.metadata))(
    'blog post $slug has its frontmatter title and description',
    async ({ slug, title, description }) => {
      const html = await readDistFile(`blog/${slug}/index.html`)

      expect(html).toContain(`<title>${escapeHtml(title)} · meowpow.dev</title>`)
      expect(html).toContain(`<meta name="description" content="${escapeHtml(description)}" />`)
    },
  )
})
