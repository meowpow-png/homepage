import { expect, test } from './fixtures'

test('scrolling highlights the active project, and clicking a timeline entry scrolls to and highlights it', async ({
  page,
}) => {
  await page.goto('/projects')

  const timelineLinks = page.locator('nav[aria-label="Project navigation"] a')
  // lazy-loaded: wait for it, .count() doesn't auto-retry like expect() does
  await expect(timelineLinks.first()).toBeVisible()
  const count = await timelineLinks.count()
  expect(count).toBeGreaterThan(1)

  const firstLink = timelineLinks.first()
  const lastLink = timelineLinks.last()

  await expect(firstLink).toHaveAttribute('aria-current', 'location')

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

  await expect(lastLink).toHaveAttribute('aria-current', 'location')
  await expect(firstLink).not.toHaveAttribute('aria-current', 'location')

  const firstHref = await firstLink.getAttribute('href')
  await firstLink.click()

  await expect(page).toHaveURL(new RegExp(`${firstHref}$`))
  await expect(firstLink).toHaveAttribute('aria-current', 'location')
})

test('mobile jump list opens and closes via toggle, Escape, and click-outside', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 800 })
  await page.goto('/projects')

  const toggle = page.getByRole('button', { name: /project list/i })
  const dropdown = page.locator('#mobile-project-navigation-list')
  const backdrop = page.locator('[aria-hidden="true"][data-open="true"]')

  await expect(toggle).toHaveAttribute('aria-expanded', 'false')

  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await expect(dropdown).toHaveAttribute('data-open', 'true')

  await page.keyboard.press('Escape')
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(dropdown).toHaveAttribute('data-open', 'false')

  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')

  await backdrop.click({ force: true })
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(dropdown).toHaveAttribute('data-open', 'false')
})

test('mobile jump list returns focus to the toggle on Escape, and closes when tabbing past the last link', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 800 })
  await page.goto('/projects')

  const toggle = page.getByRole('button', { name: /project list/i })
  const dropdown = page.locator('#mobile-project-navigation-list')

  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')

  const dropdownLinks = dropdown.locator('a')
  await dropdownLinks.first().focus()
  await page.keyboard.press('Escape')
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(toggle).toBeFocused()

  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')

  await dropdownLinks.last().focus()
  await page.keyboard.press('Tab')
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(dropdown).toHaveAttribute('data-open', 'false')
})
