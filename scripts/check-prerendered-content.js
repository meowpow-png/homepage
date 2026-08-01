const STAGING_URL = 'https://staging.meowpow.dev'

// React's marker for a Suspense boundary that never resolved server-side
const UNRESOLVED_BOUNDARY_MARKER = '<!--$!-->'

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

    const actual = mainContent.includes(UNRESOLVED_BOUNDARY_MARKER)
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

if (passes > 0) {
  console.log(`✅ ${passes} check(s) passed`)
}

if (failures > 0) {
  console.error(`❌ ${failures} check(s) failed`)
  process.exit(1)
}
