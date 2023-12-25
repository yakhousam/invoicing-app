import InvoiceModel, { type Invoice } from '@/model/invoice'
import { type ReturnedUser } from '@/routes/auth/auth.test'
import { type ReturnedClient } from '@/routes/client/client.test'
import { getCredentials, getNewClient } from '@/utils/generate'
import startServer, { type Server } from '@/utils/server'
import axios from 'axios'

const PORT = 3012

export type ReturnedInvoice = Invoice & { _id: string }

describe('Invoice', () => {
  let server: Server
  let user: ReturnedUser
  const api = axios.create({ baseURL: `http://localhost:${PORT}/api/v1` })
  beforeAll(async () => {
    server = await startServer(PORT)
    const { cookie, user: returedUser } = await getCredentials(PORT)
    user = returedUser
    api.defaults.headers.Cookie = cookie
  })

  afterAll(async () => {
    await server.close()
  })

  beforeEach(async () => {
    await InvoiceModel.deleteMany({})
  })

  it('should create an invoice', async () => {
    const client = await api.post<ReturnedClient>(
      '/clients/create',
      getNewClient()
    )
    const invoice = await api.post<ReturnedInvoice>('/invoices/create', {
      client: client.data._id,
      user: user._id,
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
    })
    expect(invoice.status).toBe(201)
    expect(invoice.data).toHaveProperty('_id')
    expect(invoice.data).toHaveProperty('client')
    expect(invoice.data).toHaveProperty('user')
    expect(invoice.data).toHaveProperty('items')
    expect(invoice.data).toHaveProperty('totalAmount')
    expect(invoice.data.totalAmount).toBe(30)
  })

  it('should return all invoices', async () => {
    const client = await api.post<ReturnedClient>(
      '/clients/create',
      getNewClient()
    )
    await api.post<ReturnedInvoice>('/invoices/create', {
      client: client.data._id,
      user: user._id,
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
    })
    await api.post<ReturnedInvoice>('/invoices/create', {
      client: client.data._id,
      user: user._id,
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
    })
    const invoices = await api.get('/invoices')
    expect(invoices.status).toBe(200)
    expect(invoices.data.length).toBe(2)
  })
})
