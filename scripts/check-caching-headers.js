const STAGING_URL = 'https://staging.meowpow.dev'

const IMMUTABLE_CACHE = /public,\s*max-age=31536000,\s*immutable/
const IMMUTABLE_CACHE_DESCRIPTION = 'public, max-age=31536000, immutable'
const REVALIDATED_CACHE = /must-revalidate|no-cache|no-store/
const REVALIDATED_CACHE_DESCRIPTION = 'must-revalidate, no-cache, or no-store'

let passes = 0
let failures = 0

function report(name, passed, expected, actual) {
  if (passed) {
    passes += 1
    return
  }
  console.log(`❌ ${name}`)
  console.log(`  - Expected: ${expected}`)
  console.log(`  - Actual: ${actual}`)
  failures += 1
}

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

if (passes > 0) {
  console.log(`✅ ${passes} check(s) passed`)
}

if (failures > 0) {
  console.error(`❌ ${failures} check(s) failed`)
  process.exit(1)
}
