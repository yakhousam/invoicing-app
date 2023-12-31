import InvoiceModel from '@/model/invoice'
import { getCredentials, getNewClient } from '@/utils/generate'
import startServer, { type Server } from '@/utils/server'
import { invoiceSchema, type Invoice } from '@/validation'
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
    const client = clientSchema.parse(
      (await api.post<Client>('/clients/create', getNewClient())).data
    )
    const invoiceResponse = await api.post<Invoice>('/invoices/create', {
      client: client._id,
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
    const client = await api.post<Client>('/clients/create', getNewClient())
    await api.post<Invoice>('/invoices/create', {
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
    await api.post<Invoice>('/invoices/create', {
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
