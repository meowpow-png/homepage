import { describe, expect, it } from 'vitest'

import { blogPosts } from '@/content/blog'
import { routes, type RoutePath } from '@/shared/routing'

import { distFileExists, readDistFile } from './helpers'

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

describe('robots.txt and sitemap.xml', () => {
  it('writes robots.txt pointing at the sitemap', async () => {
    const robotsTxt = await readDistFile('robots.txt')

    expect(robotsTxt).toContain('Sitemap: https://meowpow.dev/sitemap.xml')
  })

  it.each(Object.keys(routes) as RoutePath[])('lists %s in the sitemap', async (path) => {
    const sitemap = await readDistFile('sitemap.xml')

    expect(sitemap).toContain(`<loc>https://meowpow.dev${path}</loc>`)
  })

  it.each(blogPosts.map((post) => post.metadata.slug))(
    'lists blog post %s in the sitemap',
    async (slug) => {
      const sitemap = await readDistFile('sitemap.xml')

      expect(sitemap).toContain(`<loc>https://meowpow.dev/blog/${slug}</loc>`)
    },
  )
})
