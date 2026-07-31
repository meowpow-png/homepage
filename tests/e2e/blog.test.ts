import { expect, test } from './fixtures'

test('reading a blog post, following Next to the last post, then Previous back to the first', async ({
  page,
}) => {
  await page.goto('/blog')

  await page.locator('a[href^="/blog/"]').first().click()
  await expect(
    page.locator('footer').getByRole('link', { name: 'Blog', exact: true }),
  ).toBeVisible()

  async function goTo(name: 'Next' | 'Previous'): Promise<boolean> {
    const heading = page.locator('#post-heading')
    const before = await heading.textContent()
    const clicked = await page.evaluate((linkName) => {
      const link = [...document.querySelectorAll('a')].find(
        (a) => a.textContent?.trim() === linkName,
      )
      link?.click()
      return link !== undefined
    }, name)

    if (!clicked) {
      return false
    }
    await expect(heading).not.toHaveText(before ?? '')
    return true
  }

  let steps = 0
  while (await goTo('Next')) {
    steps += 1
    expect(steps).toBeLessThan(20)
  }
  expect(steps).toBeGreaterThan(0)

  while (await goTo('Previous')) {
    /* empty */
  }
  await expect(
    page.locator('footer').getByRole('link', { name: 'Blog', exact: true }),
  ).toBeVisible()
})

test('reading a post with embedded diagrams renders them as images', async ({ page }) => {
  await page.goto('/blog/telekom-assignment-architecture')

  // dev mode appends a query string to asset URLs, so match ".svg" loosely
  const diagrams = page.locator('.mdx-content img[src*=".svg"]')
  await expect(diagrams).toHaveCount(2)

  for (const diagram of await diagrams.all()) {
    await expect(diagram).toBeVisible()
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
