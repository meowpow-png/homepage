import { describe, expect, it } from 'vitest'

import { distFileExists, listDistHtmlFiles, readDistFile } from './helpers'

describe('asset urls in prerendered output', () => {
  it('contains no /src dev-mode paths', async () => {
    const htmlFiles = await listDistHtmlFiles()

    for (const file of htmlFiles) {
      const html = await readDistFile(file)
      expect(html, file).not.toMatch(/["'(]\/src\//)
    }
  })

  it('every referenced asset file exists in dist/assets', async () => {
    const htmlFiles = await listDistHtmlFiles()
    const assetPaths = new Set<string>()

    for (const file of htmlFiles) {
      const html = await readDistFile(file)
      for (const match of html.matchAll(/\/assets\/[^"'\s)]+/g)) {
        assetPaths.add(match[0])
      }
    }

    expect(assetPaths.size).toBeGreaterThan(0)

    for (const assetPath of assetPaths) {
      expect(await distFileExists(assetPath.slice(1)), assetPath).toBe(true)
    }
  })
})
