import { expect, test } from './fixtures'

test('reading a blog post, following Next to the last post, then Previous back to the first', async ({
  page,
}) => {
  await page.goto('/blog')

  await page.locator('a[href^="/blog/"]').first().click()
  await expect(
    page.locator('footer').getByRole('link', { name: 'Blog', exact: true }),
  ).toBeVisible()

  let nextLink = page.getByRole('link', { name: 'Next', exact: true })
  let steps = 0
  while (await nextLink.isVisible()) {
    await nextLink.click()
    steps += 1
    expect(steps).toBeLessThan(20)
    nextLink = page.getByRole('link', { name: 'Next', exact: true })
  }
  expect(steps).toBeGreaterThan(0)

  let previousLink = page.getByRole('link', { name: 'Previous', exact: true })
  while (await previousLink.isVisible()) {
    await previousLink.click()
    previousLink = page.getByRole('link', { name: 'Previous', exact: true })
  }
  await expect(
    page.locator('footer').getByRole('link', { name: 'Blog', exact: true }),
  ).toBeVisible()
})

test('reading a post with embedded diagrams renders them as SVG', async ({ page }) => {
  await page.goto('/blog/telekom-assignment-architecture')

  const diagrams = page.locator('.mermaid')
  await expect(diagrams).toHaveCount(2)

  for (const diagram of await diagrams.all()) {
    await expect(diagram.locator('svg')).toBeVisible()
  }
})

test('deep-linking directly to a post URL renders it with Blog highlighted, and stays navigable', async ({
  page,
}) => {
  await page.goto('/blog')
  const postHref = await page.locator('a[href^="/blog/"]').first().getAttribute('href')

  await page.goto(postHref!)
  await expect(page.locator('#post-heading')).toBeVisible()

  const primaryNav = page.getByLabel('Primary navigation')
  await expect(primaryNav.getByRole('link', { name: 'Blog', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  )

  await primaryNav.getByRole('link', { name: 'About', exact: true }).click()
  await expect(page).toHaveURL(/\/about$/)
  await expect(primaryNav.getByRole('link', { name: 'About', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  )
})
