import { describe, expect, it } from 'vitest'

import { escapeHtml, injectHead } from '../../../scripts/prerender.js'

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
