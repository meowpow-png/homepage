import { expect, test } from './fixtures'

test('visiting an unknown URL shows the not found page', async ({ page }) => {
  await page.goto('/this-page-does-not-exist')
  await expect(page.locator('#not-found-heading')).toHaveText('Not Found')

  for (const name of ['About', 'Projects', 'Blog', 'Questions']) {
    await expect(page.getByRole('link', { name, exact: true })).not.toHaveAttribute(
      'aria-current',
      'page',
    )
  }
})

test('visiting an unknown blog slug shows the not found page', async ({ page }) => {
  await page.goto('/blog/this-post-does-not-exist')
  await expect(page.locator('#not-found-heading')).toHaveText('Not Found')
})
