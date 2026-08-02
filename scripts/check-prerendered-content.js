import { createReporter, STAGING_URL } from './staging-check.js'

const { report, summarize } = createReporter()

// discovered from live sitemap rather than hardcoded,
// so this can't drift from what's actually deployed
async function findSitemapPaths() {
  const response = await fetch(`${STAGING_URL}/sitemap.xml`)
  const xml = await response.text()
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname)
}

async function checkPrerenderedContent(paths) {
  for (const path of paths) {
    const response = await fetch(`${STAGING_URL}${path}`)
    const html = await response.text()
    const mainContent = html.match(/id="main-content">([\s\S]*?)<\/main>/)?.[1] ?? ''

    // real page content never includes <template> tag
    const actual = mainContent.includes('<template')
      ? 'unresolved Suspense boundary'
      : mainContent.trim().length > 0
        ? 'ok'
        : 'empty main content'

    report(
      `Prerendered content for ${path}`,
      actual === 'ok',
      'real content, no unresolved Suspense boundary',
      actual,
    )
  }
}

const paths = await findSitemapPaths()

await checkPrerenderedContent(paths)

summarize()
