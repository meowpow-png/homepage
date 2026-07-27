import { expect, test } from './fixtures'

test('navigating through all pages highlights the active nav item, then the back button returns to the previous page', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/about$/)
    await expect(page.locator('#about-heading')).toBeVisible()
    await expect(page.getByRole('link', { name: 'About', exact: true })).toHaveAttribute('aria-current', 'page')

    await page.getByRole('link', { name: 'Projects', exact: true }).click()
    await expect(page).toHaveURL(/\/projects$/)
    await expect(page.locator('#projects-heading')).toHaveText('Projects')
    await expect(page.getByRole('link', { name: 'Projects', exact: true })).toHaveAttribute('aria-current', 'page')

    await page.getByRole('link', { name: 'Blog', exact: true }).click()
    await expect(page).toHaveURL(/\/blog$/)
    await expect(page.locator('#blog-heading')).toHaveText('Blog')
    await expect(page.getByRole('link', { name: 'Blog', exact: true })).toHaveAttribute('aria-current', 'page')

    await page.getByRole('link', { name: 'Questions', exact: true }).click()
    await expect(page).toHaveURL(/\/questions$/)
    await expect(page.locator('#questions-heading')).toHaveText('Questions')
    await expect(page.getByRole('link', { name: 'Questions', exact: true })).toHaveAttribute('aria-current', 'page')

    await page.goBack()
    await expect(page).toHaveURL(/\/blog$/)
    await expect(page.getByRole('link', { name: 'Blog', exact: true })).toHaveAttribute('aria-current', 'page')
})
