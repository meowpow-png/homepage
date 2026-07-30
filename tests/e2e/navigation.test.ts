import { expect, test } from './fixtures'

test('navigating through all pages highlights the active nav item, then the back button returns to the previous page', async ({
  page,
}) => {
  await page.goto('/')
  await expect(page).toHaveURL(/\/about$/)
  await expect(page.locator('#about-heading')).toBeVisible()
  await expect(page.getByRole('link', { name: 'About', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  )

  await page.getByRole('link', { name: 'Projects', exact: true }).click()
  await expect(page).toHaveURL(/\/projects$/)
  await expect(page.locator('#projects-heading')).toHaveText('Projects')
  await expect(page.getByRole('link', { name: 'Projects', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  )

  await page.getByRole('link', { name: 'Blog', exact: true }).click()
  await expect(page).toHaveURL(/\/blog$/)
  await expect(page.locator('#blog-heading')).toHaveText('Blog')
  await expect(page.getByRole('link', { name: 'Blog', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  )

  await page.getByRole('link', { name: 'Questions', exact: true }).click()
  await expect(page).toHaveURL(/\/questions$/)
  await expect(page.locator('#questions-heading')).toHaveText('Questions')
  await expect(page.getByRole('link', { name: 'Questions', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  )

  await page.goBack()
  await expect(page).toHaveURL(/\/blog$/)
  await expect(page.getByRole('link', { name: 'Blog', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  )
})

test('page title, description, and canonical update per route', async ({ page }) => {
  await page.goto('/about')
  await expect(page).toHaveTitle('Marin · meowpow.dev')
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    "I enjoy building software that makes other developers' lives a little easier.",
  )
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://meowpow.dev/about',
  )

  await page.getByRole('link', { name: 'Projects', exact: true }).click()
  await expect(page).toHaveTitle('Projects · meowpow.dev')
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    "A collection of things I've built.",
  )
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://meowpow.dev/projects',
  )

  await page.goto('/this-page-does-not-exist')
  await expect(page).toHaveTitle('Not Found · meowpow.dev')
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    'Page not found.',
  )
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0)
})

test('mobile menu opens and closes via toggle, Escape, click-outside, and link click', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 800 })
  await page.goto('/')

  const toggle = page.getByRole('button', { name: /menu/i })
  const links = page.locator('#primary-navigation-links')
  const backdrop = page.locator('[aria-hidden="true"][data-open="true"]')

  await expect(toggle).toHaveAttribute('aria-expanded', 'false')

  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await expect(links).toHaveAttribute('data-open', 'true')

  await page.keyboard.press('Escape')
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(links).toHaveAttribute('data-open', 'false')

  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')

  await backdrop.click({ force: true })
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(links).toHaveAttribute('data-open', 'false')

  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')

  await page.getByRole('link', { name: 'Projects', exact: true }).click()
  await expect(page).toHaveURL(/\/projects$/)
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
})
