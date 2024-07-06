import { API_URL } from '@/config'
import { http, HttpResponse } from 'msw'
import {
  generateClient,
  generateInvoice,
  generateInvoices,
  generateUser
} from './generate'

const authHandlers = [
  http.post(API_URL.auth.login, async () => {
    return HttpResponse.json(generateUser())
  }),
  http.post(API_URL.auth.register, async () => {
    return HttpResponse.json(generateUser())
  })
]

const clientHandlers = [
  http.post(API_URL.clients.createOne, () => {
    return HttpResponse.json(generateClient())
  }),
  http.get(API_URL.clients.getMany, () => {
    const clients = Array.from({ length: 10 }, () => generateClient())
    return HttpResponse.json(clients)
  })
]

const invoiceHandlers = [
  http.get(API_URL.invoices.getMany, () => {
    const invoices = generateInvoices()
    return HttpResponse.json({ invoices, totalInvoices: invoices.length })
  }),
  http.post(API_URL.invoices.createOne, () => {
    return HttpResponse.json(generateInvoice())
  })
]

const userHandlers = [
  http.get(API_URL.users.getProfile, async () => {
    return HttpResponse.json(generateUser())
  })
]

export const handlers = [
  ...authHandlers,
  ...clientHandlers,
  ...invoiceHandlers,
  ...userHandlers
]
