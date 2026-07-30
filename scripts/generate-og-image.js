import { chromium } from '@playwright/test'
import { resolve } from 'node:path'

const SOURCE_HTML = resolve('design/og-image/index.html')
const OUTPUT_PNG = resolve('src/shared/assets/images/og-image.png')

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
await page.goto(`file://${SOURCE_HTML}`)
await page.screenshot({ path: OUTPUT_PNG })
await browser.close()
