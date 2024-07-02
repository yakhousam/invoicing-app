import { fetchCurrentUser } from '@/api/user'
import { queryOptions } from '@tanstack/react-query'

export const userOptions = queryOptions({
  queryKey: ['user'],
  queryFn: fetchCurrentUser
})
