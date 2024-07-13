import { API_URL } from '@/config'
import { generateUser } from '@/tests/utils/generate'
import { expect, test } from '@playwright/test'

test('it redirect to dashboard after login', async ({ page }) => {
  await page.route(API_URL.auth.login, async (route) => {
    await route.fulfill({
      json: generateUser()
    })
  })

  await page.goto('/login')
  await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible()
  await page.getByLabel(/username/i).fill('test')
  await page.getByLabel(/password/i).fill('password')

  await page.getByRole('button', { name: /sign in/i }).click()

  await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible()
})
