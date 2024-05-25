import { CreateClient, clientArraySchema, clientSchema } from '@/validations'
import { fetchApi } from './util'

export const fetchClients = async () => {
  const clients = await fetchApi('/clients')
  return clientArraySchema.parse(clients)
}

export const createClient = async (client: CreateClient) => {
  const newClient = await fetchApi('/clients', {
    method: 'POST',
    body: JSON.stringify(client)
  })

  return clientSchema.parse(newClient)
}
