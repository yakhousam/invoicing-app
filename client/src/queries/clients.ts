import { fetchClients } from '@/api/clients'
import { queryOptions } from '@tanstack/react-query'

export const clientsOptions = queryOptions({
  queryKey: ['clients'],
  queryFn: fetchClients
})
