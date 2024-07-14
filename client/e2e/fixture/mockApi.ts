import { API_URL } from '@/config'
import {
  generateClients,
  generateInvoices,
  generateInvoicesSummary,
  generateInvoicesTotalsByMonth,
  generateUser
} from '@/tests/utils/generate'
import { test as base, expect } from '@playwright/test'

const test = base.extend({
  page: async ({ page }, use) => {
    // Auth
    await page.route(API_URL.auth.login, async (route) => {
      await route.fulfill({
        json: generateUser()
      })
    })
    await page.route(API_URL.auth.register, async (route) => {
      await route.fulfill({
        json: generateUser()
      })
    })
    await page.route(API_URL.auth.logout, async (route) => {
      await route.fulfill({
        json: {}
      })
    })
    // User
    await page.route(API_URL.users.getProfile, async (route) => {
      await route.fulfill({
        json: generateUser()
      })
    })
    // Invoices
    const invoicesRoute = new RegExp(API_URL.invoices.getMany)
    await page.route(invoicesRoute, async (route) => {
      const invoices = generateInvoices()
      await route.fulfill({
        json: { invoices, totalInvoices: invoices.length }
      })
    })
    // Clients
    await page.route(API_URL.clients.getMany, async (route) => {
      await route.fulfill({
        json: generateClients()
      })
    })
    // Dashboard
    await page.route(API_URL.dashboard.getSummary, async (route) => {
      await route.fulfill({
        json: generateInvoicesSummary()
      })
    })
    await page.route(API_URL.dashboard.getTotalsByMonth, async (route) => {
      await route.fulfill({
        json: generateInvoicesTotalsByMonth()
      })
    })

    await use(page)
  }
})

export { expect, test }
