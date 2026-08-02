import { describe, expect, it } from 'vitest'

import { distFileExists, listDistHtmlFiles, readDistFile } from './helpers'

describe('build hygiene', () => {
  it('does not leave the vite manifest in the final output', async () => {
    expect(await distFileExists('.vite/manifest.json')).toBe(false)
  })

  it('every prerendered file has exactly one title and description, and at most one canonical link', async () => {
    const htmlFiles = await listDistHtmlFiles()

    for (const file of htmlFiles) {
      const html = await readDistFile(file)

      expect(html.match(/<title>/g) ?? [], file).toHaveLength(1)
      expect(html.match(/<meta name="description"/g) ?? [], file).toHaveLength(1)
      expect((html.match(/<link rel="canonical"/g) ?? []).length, file).toBeLessThanOrEqual(1)
    }
  })

  it('never ships a page with an unresolved Suspense boundary', async () => {
    const htmlFiles = await listDistHtmlFiles()

    for (const file of htmlFiles) {
      const html = await readDistFile(file)

      expect(html, file).not.toContain('<!--$!-->')
    }
  })
})
