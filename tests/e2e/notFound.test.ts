import { expect, test } from './fixtures'

test('visiting an unknown URL shows the not found page', async ({ page }) => {
  await page.goto('/this-page-does-not-exist')
  await expect(page.locator('#not-found-heading')).toHaveText('Not Found')

  const primaryNav = page.getByRole('navigation', { name: 'Primary navigation' })
  for (const name of ['About', 'Projects', 'Blog', 'Questions']) {
    await expect(primaryNav.getByRole('link', { name, exact: true })).not.toHaveAttribute(
      'aria-current',
      'page',
    )
  }
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex')
})

test('navigating away from the not found page removes noindex', async ({ page }) => {
  await page.goto('/this-page-does-not-exist')
  await expect(page.locator('#not-found-heading')).toHaveText('Not Found')

  const primaryNav = page.getByRole('navigation', { name: 'Primary navigation' })
  await primaryNav.getByRole('link', { name: 'About', exact: true }).click()

  await expect(page.locator('meta[name="robots"]')).toHaveCount(0)
})

test('visiting an unknown blog slug shows the not found page', async ({ page }) => {
  await page.goto('/blog/this-post-does-not-exist')
  await expect(page.locator('#not-found-heading')).toHaveText('Not Found')
})
