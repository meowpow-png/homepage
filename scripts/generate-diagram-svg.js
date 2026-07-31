import { chromium } from '@playwright/test'
import { createServer } from 'vite'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { basename, join } from 'node:path'

const DIAGRAMS_DIR = 'design/diagrams'
const OUTPUT_DIR = 'src/shared/assets/images'

async function main() {
  // avoids a vite reload mid-render on render.html's first use of mermaid
  const vite = await createServer({ server: { port: 0 }, optimizeDeps: { include: ['mermaid'] } })
  await vite.listen()
  const baseUrl = vite.resolvedUrls.local[0]

  const browser = await chromium.launch()
  const page = await browser.newPage()

  try {
    await page.goto(`${baseUrl}design/diagrams/render.html`)
    await page.waitForFunction(() => typeof window.renderDiagram === 'function')

    const files = (await readdir(DIAGRAMS_DIR)).filter((file) => file.endsWith('.mmd'))

    for (const file of files) {
      const id = basename(file, '.mmd')
      const source = await readFile(join(DIAGRAMS_DIR, file), 'utf8')
      const svg = await page.evaluate(
        ([diagramId, diagramSource]) => window.renderDiagram(diagramId, diagramSource),
        [id, source],
      )
      const outputPath = join(OUTPUT_DIR, `${id}.svg`)
      await writeFile(outputPath, svg)
      console.log(`${file} -> ${outputPath}`)
    }
  } finally {
    await browser.close()
    await vite.close()
  }
}

await main()
