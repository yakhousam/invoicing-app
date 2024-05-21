import { fetchClients } from '@/api/clients'
import { queryOptions } from '@tanstack/react-query'

export const clientQueryOptions = queryOptions({
  queryKey: ['clients'],
  queryFn: fetchClients
})
