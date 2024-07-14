import { expect, test } from './fixture/mockApi'

test('it redirect to setting page after register', async ({ page }) => {
  await page.goto('/register')

  await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible()
  await page.getByLabel(/username/i).fill('test')
  await page.getByLabel(/^password$/i).fill('password')
  await page.getByLabel(/confirm password/i).fill('password')
  await page.getByRole('button', { name: 'Register' }).click()

  await expect(
    page.getByRole('heading', { name: /user information/i })
  ).toBeVisible()
})
