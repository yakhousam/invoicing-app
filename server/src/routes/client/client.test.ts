import ClientModel from '@/model/client'
import { getNewClient } from '@/utils/generate'
import startServer, { type Server } from '@/utils/server'

describe.skip('client', () => {
  let server: Server
  beforeAll(async () => {
    server = await startServer(3008)
  })

  afterAll(async () => {
    await server.close()
  })

  beforeEach(async () => {
    await ClientModel.deleteMany({})
  })

  it('should create a new client, return json client object', async () => {
    const mockClient = getNewClient()
    const response = await fetch('http://localhost:3008/clients/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(mockClient)
    })
    expect(response.status).toBe(201)
    console.log(response)
    // const client = (await response.json()) as Client
    // expect(client).toHaveProperty('_id')
    // expect(client.name).toBe(mockClient.name)
    // expect(client.email).toBe(mockClient.email)
  })
})
