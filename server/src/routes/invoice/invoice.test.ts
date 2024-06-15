import InvoiceModel from '@/model/invoice'
import { getCredentials, getCurrency, getNewClient } from '@/utils/generate'
import startServer, { type Server } from '@/utils/server'
import {
  invoiceArraySchema,
  invoiceSchema,
  type CreateInvoice,
  type Invoice
} from '@/validation'
import { clientSchema, type Client } from '@/validation/client'
import { type User } from '@/validation/user'
import axios from 'axios'

const PORT = 3012

describe('Invoice', () => {
  let server: Server
  let user: User
  const api = axios.create({ baseURL: `http://localhost:${PORT}/api/v1` })
  beforeAll(async () => {
    server = await startServer(PORT)
    const { cookie, user: returnedUser } = await getCredentials(PORT)
    user = returnedUser
    api.defaults.headers.Cookie = cookie
  })

  afterAll(async () => {
    await server.close()
  })

  beforeEach(async () => {
    await InvoiceModel.deleteMany({})
  })

  it('should create an invoice', async () => {
    const client = clientSchema.parse(
      (await api.post<Client>('/clients', getNewClient(null))).data
    )
    const invoiceData: CreateInvoice = {
      client: { _id: client._id },
      currency: getCurrency(),
      items: [
        {
          itemName: 'item1',
          itemPrice: 10
        },
        {
          itemName: 'item2',
          itemPrice: 20
        }
      ]
    }
    const invoiceResponse = await api.post<Invoice>('/invoices/me', invoiceData)
    expect(invoiceResponse.status).toBe(201)
    const invoice = invoiceSchema.parse(invoiceResponse.data)
    expect(invoice).toHaveProperty('_id')
    expect(invoice.client._id).toBe(client._id)
    expect(invoice.user._id).toBe(user._id)
    expect(invoice.items.length).toBe(2)
    expect(invoice.totalAmount).toBe(30)
    expect(invoice.paid).toBe(false)
    expect(invoice.status).toBe('sent')
  })

  it('should return all invoices', async () => {
    const client = await api.post<Client>('/clients', getNewClient(null))
    const invoiceData: CreateInvoice = {
      client: { _id: client.data._id },
      currency: getCurrency(),
      items: [
        {
          itemName: 'item1',
          itemPrice: 10
        },
        {
          itemName: 'item2',
          itemPrice: 20
        }
      ]
    }

    await api.post<Invoice>('/invoices/me', invoiceData)
    await api.post<Invoice>('/invoices/me', invoiceData)

    const response = await api.get('/invoices/me')
    expect(response.status).toBe(200)
    const parsedInvoices = invoiceArraySchema.parse(response.data)
    expect(parsedInvoices.length).toBe(2)
  })
})
