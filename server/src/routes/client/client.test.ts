import ClientModel, { type Client } from '@/model/client'
import { getCredentials, getNewClient } from '@/utils/generate'
import startServer, { type Server } from '@/utils/server'
import axios from 'axios'

export type ReturnedClient = Client & { _id: string }

const PORT = 3011

describe('client', () => {
  let server: Server

  const api = axios.create({ baseURL: `http://localhost:${PORT}/api/v1` })

  beforeAll(async () => {
    server = await startServer(PORT)
    const { cookie } = await getCredentials(PORT)
    api.defaults.headers.Cookie = cookie
  })

  afterAll(async () => {
    await server.close()
  })

  beforeEach(async () => {
    await ClientModel.deleteMany({})
  })

  it('should create a new client and return the client object', async () => {
    const client = getNewClient()
    const response = await api.post<ReturnedClient>('/clients/create', client)
    expect(response.status).toBe(201)
    const returnedClient = response.data
    expect(returnedClient).toHaveProperty('_id')
    expect(returnedClient.name).toBe(client.name)
    expect(returnedClient.email).toBe(client.email)
  })

  it('should return all clients', async () => {
    const client1 = getNewClient()
    const client2 = getNewClient()
    await api.post('/clients/create', client1)
    await api.post('/clients/create', client2)
    const response = await api.get<ReturnedClient[]>('/clients')
    expect(response.status).toBe(200)
    const returnedClients = response.data
    expect(returnedClients.length).toBe(2)
  })

  it('should return a client by id', async () => {
    const client = getNewClient()
    const response = await api.post<ReturnedClient>('/clients/create', client)
    const createdClient = response.data
    const response2 = await api.get<ReturnedClient>(
      `/clients/${createdClient._id}`
    )
    expect(response2.status).toBe(200)
    const returnedClient = response2.data
    expect(returnedClient.name).toBe(client.name)
    expect(returnedClient.email).toBe(client.email)
  })

  it('should update a client by id', async () => {
    const client = getNewClient()
    const response = await api.post<ReturnedClient>('/clients/create', client)
    const createdClient = response.data
    const response2 = await api.put<ReturnedClient>(
      `/clients/update/${createdClient._id}`,
      {
        name: 'updated name'
      }
    )
    expect(response2.status).toBe(200)
    const updatedClient = response2.data
    expect(updatedClient.name).toBe('updated name')
  })

  it('should delete a client by id', async () => {
    const client = getNewClient()
    const response = await api.post<ReturnedClient>('/clients/create', client)
    const createdClient = response.data
    const response2 = await api.delete<ReturnedClient>(
      `/clients/delete/${createdClient._id}`
    )
    expect(response2.status).toBe(200)
    const deletedClient = response2.data
    expect(deletedClient.name).toBe(client.name)
    expect(deletedClient.email).toBe(client.email)
  })
})
