import { API_URL } from '@/config'
import { CreateClient, clientArraySchema, clientSchema } from '@/validations'
import { fetchApi } from './util'

export const fetchClients = async () => {
  const clients = await fetchApi(API_URL.clients.getMany)
  return clientArraySchema.parse(clients)
}

export const createClient = async (client: CreateClient) => {
  const newClient = await fetchApi(API_URL.clients.createOne, {
    method: 'POST',
    body: JSON.stringify(client)
  })

  return clientSchema.parse(newClient)
}

export const fetchClient = async (id: string) => {
  const client = await fetchApi(API_URL.clients.getOne(id))
  return clientSchema.parse(client)
}

export const updateClient = async (id: string, client: CreateClient) => {
  const updatedClient = await fetchApi(API_URL.clients.updateOne(id), {
    method: 'PUT',
    body: JSON.stringify(client)
  })
  return clientSchema.parse(updatedClient)
}
