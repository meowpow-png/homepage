import { mkdir, writeFile } from 'node:fs/promises'
import { test as testBase } from '@playwright/test'

const coverageDir = 'tests/output/coverage-e2e/raw'

export const test = testBase.extend<{ autoCoverage: void }>({
  autoCoverage: [
    async ({ page }, use, testInfo) => {
      await use()

      const coverage = await page.evaluate(
        () => (window as unknown as { __coverage__?: object }).__coverage__,
      )
      if (!coverage) {
        return
      }
      await mkdir(coverageDir, { recursive: true })
      await writeFile(`${coverageDir}/${testInfo.testId}.json`, JSON.stringify(coverage))
    },
    { auto: true },
  ],
})

export { expect } from '@playwright/test'
