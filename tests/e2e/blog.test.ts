import { expect, test } from './fixtures'

test('reading a blog post, following Next to the last post, then Previous back to the first', async ({ page }) => {
    await page.goto('/blog')

    await page.locator('a[href^="/blog/"]').first().click()
    await expect(page.locator('footer').getByRole('link', { name: 'Blog', exact: true })).toBeVisible()

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
    await expect(page.locator('footer').getByRole('link', { name: 'Blog', exact: true })).toBeVisible()
})
