import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const SCAN_DIRS = ['src/content', 'src/sections']
const PREFETCH_FILE = 'src/shared/routing/prefetchImages.ts'
const IMAGE_IMPORT_PATTERN = String.raw`@/shared/assets/images/([^'"]+)`

function collectImageImports(filePath) {
  const source = readFileSync(filePath, 'utf8')
  const pattern = new RegExp(IMAGE_IMPORT_PATTERN, 'g')
  return [...source.matchAll(pattern)].map((match) => match[1])
}

function collectSourceFiles(dir) {
  return readdirSync(dir, { recursive: true })
    .filter((relativePath) => /\.(tsx|mdx|ts)$/.test(relativePath))
    .map((relativePath) => join(dir, relativePath))
}

const usedImages = new Set(SCAN_DIRS.flatMap(collectSourceFiles).flatMap(collectImageImports))
const registeredImages = new Set(collectImageImports(PREFETCH_FILE))

const missing = [...usedImages].filter((image) => !registeredImages.has(image))

if (missing.length > 0) {
  console.warn(
    `Images used in src/content or src/sections but not registered in ${PREFETCH_FILE}:\n` +
      missing.map((image) => `  - ${image}`).join('\n'),
  )
}
