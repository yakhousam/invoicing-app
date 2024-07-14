import { API_URL } from '@/config'
import { expect, test } from './fixture/mockApi'

test.describe('Login', () => {
  test('should redirect to dashboard after login', async ({ page }) => {
    await page.route(API_URL.users.getProfile, async (route) => {
      await route.abort()
    })
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible()
    await page.getByLabel(/username/i).fill('test')
    await page.getByLabel(/password/i).fill('password')

    await page.getByRole('button', { name: /sign in/i }).click()

    await expect(
      page.getByRole('heading', { name: /dashboard/i })
    ).toBeVisible()
  })
  test.describe('redirect query param', () => {
    test('should redirect to dashboard when redirect query equals to "/" ', async ({
      page
    }) => {
      const redirectUrl = '/'

      await page.goto(`/login?redirect=${redirectUrl}`)
      await expect(
        page.getByRole('heading', { name: /sign in/i })
      ).toBeVisible()
      await page.getByLabel(/username/i).fill('test')
      await page.getByLabel(/password/i).fill('password')

      await page.getByRole('button', { name: /sign in/i }).click()

      await expect(
        page.getByRole('heading', { name: /dashboard/i })
      ).toBeVisible()
    })
    test('should redirect to settings when redirect query equals to "/settings" ', async ({
      page
    }) => {
      const redirectUrl = '/settings'

      await page.goto(`/login?redirect=${redirectUrl}`)
      await expect(
        page.getByRole('heading', { name: /sign in/i })
      ).toBeVisible()
      await page.getByLabel(/username/i).fill('test')
      await page.getByLabel(/password/i).fill('password')

      await page.getByRole('button', { name: /sign in/i }).click()

      await expect(
        page.getByRole('heading', { name: /user information/i })
      ).toBeVisible()
    })

    test('should redirect to invoices when redirect query equals to "/invoices" ', async ({
      page
    }) => {
      const redirectUrl = '/invoices'

      await page.goto(`/login?redirect=${redirectUrl}`)
      await expect(
        page.getByRole('heading', { name: /sign in/i })
      ).toBeVisible()
      await page.getByLabel(/username/i).fill('test')
      await page.getByLabel(/password/i).fill('password')

      await page.getByRole('button', { name: /sign in/i }).click()

      await expect(
        page.getByRole('heading', { name: /invoices/i })
      ).toBeVisible()
    })
    test('should redirect to clients when redirect query equals to "/clients" ', async ({
      page
    }) => {
      const redirectUrl = '/clients'

      await page.goto(`/login?redirect=${redirectUrl}`)
      await expect(
        page.getByRole('heading', { name: /sign in/i })
      ).toBeVisible()
      await page.getByLabel(/username/i).fill('test')
      await page.getByLabel(/password/i).fill('password')

      await page.getByRole('button', { name: /sign in/i }).click()

      await expect(
        page.getByRole('heading', { name: /clients/i })
      ).toBeVisible()
    })
  })
})
