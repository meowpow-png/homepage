import { describe, expect, it } from 'vitest'

import { blogPosts } from '@/content/blog'
import { routes, type RoutePath } from '@/shared/routing'
import { SITE_URL } from '@/shared/siteUrl'

import { escapeHtml } from '../../scripts/prerender.js'
import { readDistFile } from './helpers'

function ogImageUrlOf(html: string): string | undefined {
  return html.match(/<meta content="([^"]*)" property="og:image" \/>/)?.[1]
}

function twitterImageUrlOf(html: string): string | undefined {
  return html.match(/<meta content="([^"]*)" name="twitter:image" \/>/)?.[1]
}

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

describe('social preview image', () => {
  it.each(Object.keys(routes) as RoutePath[])(
    '%s has a resolved og:image and matching twitter:image',
    async (path) => {
      const html = await readDistFile(`${path}/index.html`)
      const ogImage = ogImageUrlOf(html)

      expect(ogImage?.startsWith(`${SITE_URL}/assets/og-image-`)).toBe(true)
      expect(ogImage?.endsWith('.png')).toBe(true)
      expect(twitterImageUrlOf(html)).toBe(ogImage)
    },
  )

  it('404 has a resolved og:image too', async () => {
    const html = await readDistFile('404.html')
    const ogImage = ogImageUrlOf(html)

    expect(ogImage?.startsWith(`${SITE_URL}/assets/og-image-`)).toBe(true)
    expect(ogImage?.endsWith('.png')).toBe(true)
  })
})
