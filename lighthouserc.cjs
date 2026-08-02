const { readFileSync } = require('node:fs')

const SITEMAP_PATH = 'dist/sitemap.xml'

function collectSitemapPaths() {
  const sitemap = readFileSync(SITEMAP_PATH, 'utf8')
  const locs = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1])

  // a trailing slash maps directly onto the prerendered dist/<path>/index.html
  // files, avoiding the redirect express.static would otherwise issue
  return locs.map((loc) => {
    const { pathname } = new URL(loc)
    return pathname.endsWith('/') ? pathname : `${pathname}/`
  })
}

module.exports = {
  ci: {
    collect: {
      staticDistDir: 'dist',
      url: collectSitemapPaths(),
      numberOfRuns: 1,
      // containers and CI runners commonly run as root with no user
      // namespace sandbox available, which Chrome refuses to start without
      settings: {
        chromeFlags: ['--no-sandbox'],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: './.lighthouseci',
    },
  },
}
