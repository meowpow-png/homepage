import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

import { listDistHtmlFiles, readDistFile } from './helpers'

const { version } = JSON.parse(readFileSync('./package.json', 'utf8'))

describe('footer version', () => {
  it('every prerendered page displays the package.json version', async () => {
    const htmlFiles = await listDistHtmlFiles()

    for (const file of htmlFiles) {
      const html = await readDistFile(file)

      expect(html, file).toContain(`v${version}`)
    }
  })
})
