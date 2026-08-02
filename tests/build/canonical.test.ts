import { describe, expect, it } from 'vitest'

import { blogPosts } from '@/content/blog'
import { routes, type RoutePath } from '@/shared/routing'
import { SITE_URL } from '@/shared/siteUrl'

import { readDistFile } from './helpers'

function canonicalHrefOf(html: string): string | undefined {
  return html.match(/<link rel="canonical" href="([^"]*)" \/>/)?.[1]
}

describe('canonical links', () => {
  it.each(Object.keys(routes) as RoutePath[])('%s has its own canonical URL', async (path) => {
    const html = await readDistFile(`${path}/index.html`)
    expect(canonicalHrefOf(html)).toBe(`${SITE_URL}${path}`)
  })

  it.each(blogPosts.map((post) => post.metadata.slug))(
    'blog post %s has its own canonical URL',
    async (slug) => {
      const html = await readDistFile(`blog/${slug}/index.html`)
      expect(canonicalHrefOf(html)).toBe(`${SITE_URL}/blog/${slug}`)
    },
  )

  it('root and /about share the identical canonical URL', async () => {
    const root = await readDistFile('index.html')
    const about = await readDistFile('about/index.html')

    expect(canonicalHrefOf(root)).toBe(`${SITE_URL}/about`)
    expect(canonicalHrefOf(about)).toBe(`${SITE_URL}/about`)
  })

  it('404 has no canonical link', async () => {
    const html = await readDistFile('404.html')
    expect(html).not.toContain('rel="canonical"')
  })
})
