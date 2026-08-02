import { STAGING_URL } from './staging-check.js'

async function contentEncodingFor(path) {
  const response = await fetch(`${STAGING_URL}${path}`, {
    headers: { 'accept-encoding': 'br, gzip' },
  })
  return response.headers.get('content-encoding') ?? 'none'
}

async function findJsAssetPaths() {
  const response = await fetch(STAGING_URL)
  const html = await response.text()
  const matches = [...html.matchAll(/\/assets\/[^"'\s]+\.js/g)]
  return [...new Set(matches.map((match) => match[0]))]
}

async function reportEncodings(paths) {
  for (const path of paths) {
    const encoding = await contentEncodingFor(path)
    console.log(`${path}: ${encoding}`)
  }
}

const jsAssetPaths = await findJsAssetPaths()

await reportEncodings(jsAssetPaths)
await reportEncodings(['/', '/about/'])
await reportEncodings(['/sitemap.xml', '/robots.txt'])
