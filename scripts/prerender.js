import { createServer } from 'vite'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

const DIST = 'dist'
const MANIFEST_PATH = join(DIST, '.vite/manifest.json')

// not a real route: resolveRoute() won't match it, so app renders <NotFound/>
const NOT_FOUND_PATHNAME = '/__prerender_404__'

async function collectPaths(vite) {
  const { routes } = await vite.ssrLoadModule('/src/shared/routing/routes.tsx')
  const { blogPosts } = await vite.ssrLoadModule('/src/content/blog/index.ts')

  return [...Object.keys(routes), ...blogPosts.map((post) => `/blog/${post.metadata.slug}`)]
}

async function loadAssetMap() {
  const manifest = JSON.parse(await readFile(MANIFEST_PATH, 'utf8'))
  return Object.entries(manifest).map(([source, entry]) => [`/${source}`, `/${entry.file}`])
}

function resolveAssetUrls(html, assetMap) {
  return assetMap.reduce(
    (resolved, [devUrl, prodUrl]) => resolved.replaceAll(devUrl, prodUrl),
    html,
  )
}

async function renderPage(vite, template, assetMap, pathname) {
  const { App } = await vite.ssrLoadModule('/src/App.tsx')
  const appHtml = renderToString(createElement(App, { initialPathname: pathname }))
  const html = template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)

  return resolveAssetUrls(html, assetMap)
}

async function writeFileEnsuringDir(path, contents) {
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, contents)
}

async function main() {
  const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' })

  try {
    const template = await readFile(join(DIST, 'index.html'), 'utf8')
    const assetMap = await loadAssetMap()
    const paths = await collectPaths(vite)

    for (const pathname of paths) {
      const html = await renderPage(vite, template, assetMap, pathname)
      await writeFileEnsuringDir(join(DIST, pathname, 'index.html'), html)
    }

    // '/' normalizes to '/about' client-side, so the root document gets the same content
    await writeFileEnsuringDir(
      join(DIST, 'index.html'),
      await renderPage(vite, template, assetMap, '/'),
    )

    // Vercel serves this automatically, with a real
    // 404 status, for any path with no matching file
    await writeFileEnsuringDir(
      join(DIST, '404.html'),
      await renderPage(vite, template, assetMap, NOT_FOUND_PATHNAME),
    )
  } finally {
    await vite.close()
  }

  // build-time artifact only, not needed at runtime
  await rm(MANIFEST_PATH)
}

await main()
