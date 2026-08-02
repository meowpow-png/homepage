import { copyFileSync, readFileSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'

const MANIFEST_PATH = '.lighthouseci/manifest.json'
const TEMPLATE_DIR = 'design/lighthouse'
const OUTPUT_DIR = '.lighthouseci'
const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo']

function scoreClass(score) {
  if (score >= 0.9) return 'good'
  if (score >= 0.5) return 'okay'
  return 'bad'
}

function scoreCell(score) {
  return `<td><span class="score ${scoreClass(score)}">${Math.round(score * 100)}</span></td>`
}

function reportRow(entry) {
  const { pathname } = new URL(entry.url)
  const cells = CATEGORIES.map((category) => scoreCell(entry.summary[category])).join('')
  const filename = entry.htmlPath.split('/').pop()

  return `<tr><td><a href="./${filename}">${pathname}</a></td>${cells}</tr>`
}

// the template lives two directories deep (design/lighthouse/), the
// generated output only one (.lighthouseci/), so shared asset links need
// re-pointing rather than copied as-is
function relinkAsset(html, assetSuffix) {
  const targetFromRoot = html.match(new RegExp(`href="([^"]*${assetSuffix})"`))?.[1]
  if (!targetFromRoot) throw new Error(`Could not find asset link for ${assetSuffix}`)

  const pathFromRoot = join(TEMPLATE_DIR, targetFromRoot)
  const relinked = relative(OUTPUT_DIR, pathFromRoot)

  return html.replace(targetFromRoot, relinked)
}

function buildIndex(manifest) {
  const template = readFileSync(join(TEMPLATE_DIR, 'index.html'), 'utf8')
  const rows = manifest
    .sort((a, b) => new URL(a.url).pathname.localeCompare(new URL(b.url).pathname))
    .map(reportRow)
    .join('\n        ')

  return relinkAsset(relinkAsset(template, 'tokens.css'), 'latin-500.css').replace(
    '<tbody id="rows"></tbody>',
    `<tbody id="rows">\n        ${rows}\n      </tbody>`,
  )
}

const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'))
writeFileSync(join(OUTPUT_DIR, 'index.html'), buildIndex(manifest))
copyFileSync(join(TEMPLATE_DIR, 'lighthouse.css'), join(OUTPUT_DIR, 'lighthouse.css'))
