import { expect, test } from './fixture/mockApi'

test.describe('Logout', () => {
  test('should log out user', async ({ page }) => {
    await page.goto('/')
    await expect(
      page.getByRole('heading', { name: /dashboard/i })
    ).toBeVisible()

    await page.getByLabel(/account of current user/i).click()
    await page.getByLabel(/logout/i).click()

    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible()
  })
})
