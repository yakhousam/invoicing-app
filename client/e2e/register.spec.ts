import { API_URL } from '@/config'
import { generateUser } from '@/tests/utils/generate'
import { expect, test } from '@playwright/test'

test('it redirect to setting page after register', async ({ page }) => {
  await page.route(API_URL.auth.register, async (route) => {
    await route.fulfill({
      json: generateUser()
    })
  })

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
