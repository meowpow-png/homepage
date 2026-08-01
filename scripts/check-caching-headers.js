import { createReporter, STAGING_URL } from './staging-check.js'

const IMMUTABLE_CACHE = /public,\s*max-age=31536000,\s*immutable/
const IMMUTABLE_CACHE_DESCRIPTION = 'public, max-age=31536000, immutable'
const REVALIDATED_CACHE = /must-revalidate|no-cache|no-store/
const REVALIDATED_CACHE_DESCRIPTION = 'must-revalidate, no-cache, or no-store'

const { report, summarize } = createReporter()

async function headersFor(path) {
  const response = await fetch(`${STAGING_URL}${path}`, { method: 'HEAD' })
  return response.headers
}

async function findAssetPaths() {
  const response = await fetch(STAGING_URL)
  const html = await response.text()
  const matches = [...html.matchAll(/\/assets\/[^"'\s]+\.(js|woff2?|png|webp|svg)/g)]
  return [...new Set(matches.map((match) => match[0]))]
}

async function checkHashedAssets(assetPaths) {
  for (const path of assetPaths) {
    const headers = await headersFor(path)
    const cacheControl = headers.get('cache-control') ?? ''
    report(
      `Hashed asset ${path}`,
      IMMUTABLE_CACHE.test(cacheControl),
      IMMUTABLE_CACHE_DESCRIPTION,
      cacheControl,
    )
  }
}

async function checkHtmlDocuments() {
  for (const path of ['/', '/about/']) {
    const headers = await headersFor(path)
    const cacheControl = headers.get('cache-control') ?? ''
    report(
      `HTML document ${path}`,
      REVALIDATED_CACHE.test(cacheControl),
      REVALIDATED_CACHE_DESCRIPTION,
      cacheControl,
    )
  }
}

async function checkCrawlerFiles() {
  for (const path of ['/sitemap.xml', '/robots.txt']) {
    const headers = await headersFor(path)
    const cacheControl = headers.get('cache-control') ?? ''
    report(
      `Crawler file ${path}`,
      REVALIDATED_CACHE.test(cacheControl),
      REVALIDATED_CACHE_DESCRIPTION,
      cacheControl,
    )
  }
}

async function checkEdgeCache(assetPaths) {
  const [path] = assetPaths
  if (!path) return

  await headersFor(path)
  const headers = await headersFor(path)
  const cacheStatus = headers.get('x-vercel-cache') ?? 'missing header'
  report(`Edge cache for ${path}`, cacheStatus === 'HIT', 'HIT', cacheStatus)
}

const assetPaths = await findAssetPaths()

await checkHashedAssets(assetPaths)
await checkHtmlDocuments()
await checkCrawlerFiles()
await checkEdgeCache(assetPaths)

summarize()
