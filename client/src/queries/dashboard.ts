import { fetchSummary } from '@/api/dashboard'
import { queryOptions } from '@tanstack/react-query'

export const summaryOptions = queryOptions({
  queryKey: ['summary'],
  queryFn: fetchSummary
})
