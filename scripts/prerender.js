import { createServer } from 'vite'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

const DIST = 'dist'
const MANIFEST_PATH = join(DIST, '.vite/manifest.json')

// not a real route: resolveRoute() won't match it, so app renders <NotFound/>
const NOT_FOUND_PATHNAME = '/__prerender_404__'
const NOT_FOUND_ENTRY = { title: 'Not Found', description: 'Page not found.' }

export function escapeHtml(text) {
  return text.replace(
    /[&<>"]/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char],
  )
}

async function collectRouteEntries(vite) {
  const { routes } = await vite.ssrLoadModule('/src/shared/routing/routes.tsx')
  const { blogPosts } = await vite.ssrLoadModule('/src/content/blog/index.ts')

  const staticEntries = Object.entries(routes).map(([pathname, route]) => ({
    pathname,
    title: route.title,
    description: route.description,
  }))

  const blogEntries = blogPosts.map((post) => ({
    pathname: `/blog/${post.metadata.slug}`,
    title: post.metadata.title,
    description: post.metadata.description,
    lastmod: post.metadata.modifiedAt,
  }))

  return [...staticEntries, ...blogEntries]
}

export function buildSitemap(entries, siteUrl) {
  const urls = entries
    .map((entry) => {
      const lastmod = entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : ''
      return `  <url>\n    <loc>${siteUrl}${entry.pathname}</loc>${lastmod}\n  </url>`
    })
    .join('\n')

  // noinspection HttpUrlsUsage
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

async function loadManifest() {
  return JSON.parse(await readFile(MANIFEST_PATH, 'utf8'))
}

// maps dev-mode /src/... paths to their hashed dist/ files
function buildAssetMap(manifest) {
  return Object.entries(manifest).map(([source, entry]) => [`/${source}`, `/${entry.file}`])
}

// a lazy section's chunk + static deps, stopping at entry chunks (already on the page)
export function collectSectionPreloads(manifest, sourcePath, seen = new Set()) {
  const key = sourcePath.replace(/^\//, '')
  const entry = manifest[key]

  if (!entry || entry.isEntry || seen.has(key)) {
    return []
  }
  seen.add(key)

  return [
    `/${entry.file}`,
    ...(entry.imports ?? []).flatMap((importKey) =>
      collectSectionPreloads(manifest, importKey, seen),
    ),
  ]
}

function resolveAssetUrls(html, assetMap) {
  return assetMap.reduce(
    (resolved, [devUrl, prodUrl]) => resolved.replaceAll(devUrl, prodUrl),
    html,
  )
}

function replaceMetaContent(html, attr, property, content) {
  return html.replace(
    new RegExp(`<meta\\s+content="[^"]*"\\s+${attr}="${property}"\\s*/>`),
    `<meta content="${escapeHtml(content)}" ${attr}="${property}" />`,
  )
}

// keep in sync with App.tsx's client-side metadata effect
export function injectHead(html, { title, description, canonicalUrl, ogImageUrl }) {
  const socialFields = [
    ['property', 'og:title', title],
    ['property', 'og:description', description],
    ['property', 'og:image', ogImageUrl],
    ['name', 'twitter:title', title],
    ['name', 'twitter:description', description],
    ['name', 'twitter:image', ogImageUrl],
  ]
  const withMeta = socialFields
    .reduce(
      (acc, [attr, property, content]) => replaceMetaContent(acc, attr, property, content),
      html,
    )
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)} · meowpow.dev</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
      `<meta name="description" content="${escapeHtml(description)}" />`,
    )

  // error pages have no canonical version, so drop canonical/og:url instead
  if (!canonicalUrl) {
    return withMeta
      .replace(/\s*<link rel="canonical" href="[^"]*" \/>\n?/, '\n')
      .replace(/\s*<meta content="[^"]*" property="og:url" \/>\n?/, '\n')
  }

  return replaceMetaContent(
    withMeta.replace(
      /<link rel="canonical" href="[^"]*" \/>/,
      `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`,
    ),
    'property',
    'og:url',
    canonicalUrl,
  )
}

// pre-warmed below to avoid a cold transform mid-render
const SECTION_MODULE_BY_PAGE = {
  about: '/src/sections/About/index.ts',
  projects: '/src/sections/Projects/index.ts',
  blog: '/src/sections/Blog/index.ts',
  questions: '/src/sections/Questions/index.ts',
}

// only way a shared template's <head> gets the lazy chunks it needs
export function injectSectionPreloads(html, hrefs) {
  const newHrefs = hrefs.filter((href) => !html.includes(href))

  if (newHrefs.length === 0) {
    return html
  }
  const links = newHrefs.map((href) => `  <link rel="modulepreload" crossorigin href="${href}">`)
  return html.replace('</head>', `${links.join('\n')}\n</head>`)
}

// starts the fetch earlier than CSS discovery would, to beat font-display: optional's grace period
const CRITICAL_FONT_SOURCE =
  'node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2'

export function injectFontPreload(html, manifest) {
  const entry = manifest[CRITICAL_FONT_SOURCE]

  if (!entry) {
    return html
  }
  const link = `  <link rel="preload" as="font" type="font/woff2" crossorigin href="/${entry.file}">`
  return html.replace('</head>', `${link}\n</head>`)
}

// renderToString always bails on the first pass; retry until the lazy import settles (see docs/notes)
const RENDER_TIMEOUT_MS = 10_000
const RETRY_DELAYS_MS = [10, 25, 50, 100, 200, 400, 800, 1600, 3200]

function isUnresolved(html) {
  return html.includes('<!--$!-->')
}

export async function renderToHtml(element, timeoutMs = RENDER_TIMEOUT_MS) {
  const deadline = Date.now() + timeoutMs
  let html = renderToString(element)

  for (const delay of RETRY_DELAYS_MS) {
    if (!isUnresolved(html)) {
      return html
    }
    if (Date.now() + delay > deadline) {
      break
    }
    await new Promise((resolve) => setTimeout(resolve, delay))
    html = renderToString(element)
  }

  if (isUnresolved(html)) {
    throw new Error(`A Suspense boundary never resolved after ${timeoutMs}ms`)
  }
  return html
}

export async function renderPage(
  vite,
  template,
  manifest,
  assetMap,
  pathname,
  meta,
  canonicalPath = pathname,
) {
  const { SITE_URL } = await vite.ssrLoadModule('/src/shared/siteUrl.ts')
  const { OG_IMAGE_URL } = await vite.ssrLoadModule('/src/shared/ogImageUrl.ts')
  const { App } = await vite.ssrLoadModule('/src/App.tsx')
  const { resolveRoute } = await vite.ssrLoadModule('/src/shared/routing/resolveRoute.ts')

  const sectionModule = SECTION_MODULE_BY_PAGE[resolveRoute(pathname)?.currentPage]
  let preloadedTemplate = template
  if (sectionModule) {
    await vite.ssrLoadModule(sectionModule)
    preloadedTemplate = injectSectionPreloads(
      template,
      collectSectionPreloads(manifest, sectionModule),
    )
  }

  const element = createElement(App, { initialPathname: pathname })
  const appHtml = await renderToHtml(element).catch((error) => {
    throw new Error(`Failed to prerender ${pathname}: ${error.message}`, { cause: error })
  })
  const html = preloadedTemplate.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
  const canonicalUrl = canonicalPath && `${SITE_URL}${canonicalPath}`
  const ogImageUrl = `${SITE_URL}${OG_IMAGE_URL}`

  return resolveAssetUrls(injectHead(html, { ...meta, canonicalUrl, ogImageUrl }), assetMap)
}

async function writeFileEnsuringDir(path, contents) {
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, contents)
}

async function main() {
  const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' })

  try {
    const rawTemplate = await readFile(join(DIST, 'index.html'), 'utf8')
    const manifest = await loadManifest()
    const template = injectFontPreload(rawTemplate, manifest)
    const assetMap = buildAssetMap(manifest)
    const entries = await collectRouteEntries(vite)

    for (const entry of entries) {
      const html = await renderPage(vite, template, manifest, assetMap, entry.pathname, entry)
      await writeFileEnsuringDir(join(DIST, entry.pathname, 'index.html'), html)
    }
    // '/' is byte-identical to '/about' client-side, so it canonicalizes there too
    const aboutEntry = entries.find((entry) => entry.pathname === '/about')
    await writeFileEnsuringDir(
      join(DIST, 'index.html'),
      await renderPage(vite, template, manifest, assetMap, '/', aboutEntry, '/about'),
    )
    // Vercel serves this for any unmatched path with a real 404 status
    await writeFileEnsuringDir(
      join(DIST, '404.html'),
      await renderPage(
        vite,
        template,
        manifest,
        assetMap,
        NOT_FOUND_PATHNAME,
        NOT_FOUND_ENTRY,
        null,
      ),
    )
    // reuses the loop's entries so the sitemap can't drift from what's built
    const { SITE_URL } = await vite.ssrLoadModule('/src/shared/siteUrl.ts')
    await writeFileEnsuringDir(join(DIST, 'sitemap.xml'), buildSitemap(entries, SITE_URL))
  } finally {
    await vite.close()
  }

  // build-time artifact only, not needed at runtime
  await rm(MANIFEST_PATH)
}

// only run via `node scripts/prerender.js`, not when tests import this file
if (import.meta.url === `file://${process.argv[1]}`) {
  await main()
}
