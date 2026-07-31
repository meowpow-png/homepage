import { createElement, lazy, Suspense } from 'react'
import { describe, expect, it } from 'vitest'

import { buildSitemap, escapeHtml, injectHead, renderToHtml } from '../../../scripts/prerender.js'

function resolveAfterTicks(value: unknown, ticks: number) {
  return new Promise((resolve) => {
    function tick(remaining: number) {
      if (remaining <= 0) {
        resolve(value)
        return
      }
      setImmediate(() => tick(remaining - 1))
    }
    tick(ticks)
  })
}

function lazyElement(ticks: number) {
  const LazyComponent = lazy(
    () =>
      resolveAfterTicks({ default: () => 'resolved' }, ticks) as Promise<{ default: () => string }>,
  )
  return createElement(Suspense, { fallback: 'loading' }, createElement(LazyComponent))
}

describe('escapeHtml', () => {
  it('escapes HTML-significant characters', () => {
    expect(escapeHtml('<b>&"quoted"</b>')).toBe('&lt;b&gt;&amp;&quot;quoted&quot;&lt;/b&gt;')
  })

  it('leaves plain text unchanged', () => {
    expect(escapeHtml("Marin's projects")).toBe("Marin's projects")
  })
})

const template = `<!doctype html>
<html lang="en">
  <head>
    <title>Placeholder</title>
    <meta name="description" content="Placeholder description." />
    <link rel="canonical" href="https://meowpow.dev/placeholder" />
    <meta content="https://meowpow.dev/placeholder" property="og:url" />
    <meta content="Placeholder" property="og:title" />
    <meta content="Placeholder description." property="og:description" />
    <meta content="https://meowpow.dev/placeholder.png" property="og:image" />
    <meta content="Placeholder" name="twitter:title" />
    <meta content="Placeholder description." name="twitter:description" />
    <meta content="https://meowpow.dev/placeholder.png" name="twitter:image" />
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
`

describe('injectHead', () => {
  it('replaces the title, description, and canonical link', () => {
    const html = injectHead(template, {
      title: 'Projects',
      description: "A collection of things I've built.",
      canonicalUrl: 'https://meowpow.dev/projects',
      ogImageUrl: 'https://meowpow.dev/og-image.png',
    })

    expect(html).toContain('<title>Projects · meowpow.dev</title>')
    expect(html).toContain(
      '<meta name="description" content="A collection of things I\'ve built." />',
    )
    expect(html).toContain('<link rel="canonical" href="https://meowpow.dev/projects" />')
  })

  it('replaces the og: and twitter: title, description, image, and url', () => {
    const html = injectHead(template, {
      title: 'Projects',
      description: "A collection of things I've built.",
      canonicalUrl: 'https://meowpow.dev/projects',
      ogImageUrl: 'https://meowpow.dev/og-image.png',
    })

    expect(html).toContain('<meta content="Projects" property="og:title" />')
    expect(html).toContain(
      '<meta content="A collection of things I\'ve built." property="og:description" />',
    )
    expect(html).toContain(
      '<meta content="https://meowpow.dev/og-image.png" property="og:image" />',
    )
    expect(html).toContain('<meta content="https://meowpow.dev/projects" property="og:url" />')
    expect(html).toContain('<meta content="Projects" name="twitter:title" />')
    expect(html).toContain(
      '<meta content="A collection of things I\'ve built." name="twitter:description" />',
    )
    expect(html).toContain(
      '<meta content="https://meowpow.dev/og-image.png" name="twitter:image" />',
    )
  })

  it('escapes HTML-significant characters in title and description', () => {
    const html = injectHead(template, {
      title: 'A & B',
      description: '"Quoted" <text>',
      canonicalUrl: 'https://meowpow.dev/a-b',
      ogImageUrl: 'https://meowpow.dev/og-image.png',
    })

    expect(html).toContain('<title>A &amp; B · meowpow.dev</title>')
    expect(html).toContain('content="&quot;Quoted&quot; &lt;text&gt;"')
  })

  it('omits the canonical link and og:url entirely when canonicalUrl is falsy', () => {
    const html = injectHead(template, {
      title: 'Not Found',
      description: 'Page not found.',
      canonicalUrl: null,
      ogImageUrl: 'https://meowpow.dev/og-image.png',
    })

    expect(html).not.toContain('rel="canonical"')
    expect(html).not.toContain('property="og:url"')
  })
})

describe('buildSitemap', () => {
  it('lists a <url> entry per pathname, in order', () => {
    const xml = buildSitemap(
      [{ pathname: '/about' }, { pathname: '/projects' }],
      'https://meowpow.dev',
    )

    const aboutIndex = xml.indexOf('https://meowpow.dev/about')
    const projectsIndex = xml.indexOf('https://meowpow.dev/projects')

    expect(aboutIndex).toBeGreaterThan(-1)
    expect(projectsIndex).toBeGreaterThan(aboutIndex)
  })

  it('includes lastmod only for entries that have one', () => {
    const xml = buildSitemap(
      [{ pathname: '/about' }, { pathname: '/blog/post', lastmod: '2026-01-15' }],
      'https://meowpow.dev',
    )

    expect(xml).not.toMatch(/<loc>https:\/\/meowpow\.dev\/about<\/loc>\s*<lastmod>/)
    expect(xml).toContain(
      '<loc>https://meowpow.dev/blog/post</loc>\n    <lastmod>2026-01-15</lastmod>',
    )
  })

  it('produces well-formed XML with the sitemap namespace', () => {
    const xml = buildSitemap([{ pathname: '/about' }], 'https://meowpow.dev')

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>')
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    expect(xml).toContain('</urlset>')
  })
})

describe('renderToHtml', () => {
  it('returns the real output for an already-resolved element', async () => {
    const html = await renderToHtml(lazyElement(0))

    expect(html).toContain('resolved')
  })

  it('waits for a lazy import that resolves a few ticks later', async () => {
    const html = await renderToHtml(lazyElement(5))

    expect(html).toContain('resolved')
  })

  it('throws if the Suspense boundary never resolves', async () => {
    const NeverResolves = lazy(() => new Promise<{ default: () => string }>(() => {}))
    const element = createElement(Suspense, { fallback: 'loading' }, createElement(NeverResolves))

    await expect(renderToHtml(element, 50)).rejects.toThrow(
      'A Suspense boundary never resolved after 50ms',
    )
  })
})
