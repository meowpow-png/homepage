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

  it('the mermaid post prerenders both diagram placeholders without crashing', async () => {
    // mermaid.render() only runs client-side inside useEffect, which never executes
    // during renderToString, so the placeholder stays empty here, that's expected.
    // This only proves the route rendered at all, guarding the circular-import bug
    // that used to crash this specific post during prerendering.
    const html = await readDistFile('blog/telekom-assignment-architecture/index.html')
    const placeholders = html.match(/<div class="mermaid"><\/div>/g) ?? []

    expect(placeholders).toHaveLength(2)
  })
})
