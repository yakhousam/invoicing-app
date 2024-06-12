import { fetchSummary, fetchTotalsByMonth } from '@/api/dashboard'
import { queryOptions } from '@tanstack/react-query'

export const summaryOptions = queryOptions({
  queryKey: ['summary'],
  queryFn: fetchSummary
})

export const totalsByMonthOptions = queryOptions({
  queryKey: ['totalsByMonth'],
  queryFn: fetchTotalsByMonth
})
