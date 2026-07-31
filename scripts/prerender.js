import { createServer } from 'vite'
import { createElement } from 'react'
import { prerenderToNodeStream } from 'react-dom/static'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { text } from 'node:stream/consumers'

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

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

async function loadManifest() {
  return JSON.parse(await readFile(MANIFEST_PATH, 'utf8'))
}

// ssrLoadModule renders dev-mode asset paths (/src/...) that don't exist in
// dist/, so map each one to its hashed prod path via the build manifest
function buildAssetMap(manifest) {
  return Object.entries(manifest).map(([source, entry]) => [`/${source}`, `/${entry.file}`])
}

// walks a manifest entry's static imports to collect every chunk a
// React.lazy() section needs, stopping at entry chunks (e.g. index.html)
// since those are already loaded via the page's own <script> tag
export function collectSectionPreloads(manifest, sourcePath, seen = new Set()) {
  const key = sourcePath.replace(/^\//, '')
  const entry = manifest[key]

  if (!entry || entry.isEntry || seen.has(key)) {
    return []
  }
  seen.add(key)

  return [
    `/${entry.file}`,
    ...(entry.imports ?? []).flatMap((importKey) => collectSectionPreloads(manifest, importKey, seen)),
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

// keep in sync with App.tsx's metadata effect: same title/description/canonical/
// image rules must apply server-side (this function) and client-side
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

  // an error page isn't "the" canonical version of anything, so drop canonical
  // and og:url instead of pointing them at the internal not-found sentinel path
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

// section module per page, pre-warmed below to avoid a cold transform mid-render
const SECTION_MODULE_BY_PAGE = {
  about: '/src/sections/About/index.ts',
  projects: '/src/sections/Projects/index.ts',
  blog: '/src/sections/Blog/index.ts',
  questions: '/src/sections/Questions/index.ts',
}

// every page shares one template, so this is the only way its <head>
// ends up mentioning the chunks React.lazy() fetches on hydration
export function injectSectionPreloads(html, hrefs) {
  const newHrefs = hrefs.filter((href) => !html.includes(href))

  if (newHrefs.length === 0) {
    return html
  }
  const links = newHrefs.map((href) => `  <link rel="modulepreload" crossorigin href="${href}">`)
  return html.replace('</head>', `${links.join('\n')}\n</head>`)
}

// unlike renderToString, this waits for Suspense to resolve; timeout guards
// against a boundary that never does
const RENDER_TIMEOUT_MS = 10_000

export async function renderToHtml(element, timeoutMs = RENDER_TIMEOUT_MS) {
  let timeoutId

  const timeout = new Promise((_resolve, reject) => {
    timeoutId = setTimeout(
      () => reject(new Error(`A Suspense boundary never resolved after ${timeoutMs}ms`)),
      timeoutMs,
    )
  })

  try {
    const { prelude } = await Promise.race([prerenderToNodeStream(element), timeout])
    return await text(prelude)
  } finally {
    clearTimeout(timeoutId)
  }
}

async function renderPage(
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
    preloadedTemplate = injectSectionPreloads(template, collectSectionPreloads(manifest, sectionModule))
  }

  const element = createElement(App, { initialPathname: pathname })
  const appHtml = await renderToHtml(element)
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
    const template = await readFile(join(DIST, 'index.html'), 'utf8')
    const manifest = await loadManifest()
    const assetMap = buildAssetMap(manifest)
    const entries = await collectRouteEntries(vite)

    for (const entry of entries) {
      const html = await renderPage(vite, template, manifest, assetMap, entry.pathname, entry)
      await writeFileEnsuringDir(join(DIST, entry.pathname, 'index.html'), html)
    }

    // '/' normalizes to '/about' client-side and is byte-identical content, so it
    // canonicalizes to '/about' too rather than splitting the two into duplicates
    const aboutEntry = entries.find((entry) => entry.pathname === '/about')
    await writeFileEnsuringDir(
      join(DIST, 'index.html'),
      await renderPage(vite, template, manifest, assetMap, '/', aboutEntry, '/about'),
    )

    // Vercel serves this automatically, with a real 404 status, for any path with
    // no matching file; canonicalPath is null since an error page canonicalizes to nothing
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

    // reuses the same entries the loop above just prerendered, so the sitemap
    // can't list a page that doesn't exist or omit one that does
    const { SITE_URL } = await vite.ssrLoadModule('/src/shared/siteUrl.ts')
    await writeFileEnsuringDir(join(DIST, 'sitemap.xml'), buildSitemap(entries, SITE_URL))
  } finally {
    await vite.close()
  }

  // build-time artifact only, not needed at runtime
  await rm(MANIFEST_PATH)
}

// only run when executed directly via `node scripts/prerender.js`,
// not when imported elsewhere (e.g. tests importing escapeHtml/injectHead)
if (import.meta.url === `file://${process.argv[1]}`) {
  await main()
}
