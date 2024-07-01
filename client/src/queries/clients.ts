import { fetchClient, fetchClients } from '@/api/clients'
import { queryOptions } from '@tanstack/react-query'

export const clientsOptions = queryOptions({
  queryKey: ['clients'],
  queryFn: fetchClients
})

export const clientByIdOptions = (id: string) =>
  queryOptions({
    queryKey: ['clients', id],
    queryFn: () => fetchClient(id)
  })
