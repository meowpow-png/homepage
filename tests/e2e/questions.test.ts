import { expect, test } from './fixtures'

test('expanding a question reveals its answer, and collapses again', async ({ page }) => {
  await page.goto('/questions')

  const firstQuestion = page.locator('details').first()
  const summary = firstQuestion.locator('summary')

  await expect(firstQuestion).not.toHaveAttribute('open')

  await summary.click()
  await expect(firstQuestion).toHaveAttribute('open')

  await summary.click()
  await expect(firstQuestion).not.toHaveAttribute('open')
})
