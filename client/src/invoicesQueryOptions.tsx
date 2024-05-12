import { fetchInvoices } from '@/api/invoice'
import { queryOptions } from '@tanstack/react-query'

export const invoicesQueryOptions = queryOptions({
  queryKey: ['invoices'],
  queryFn: fetchInvoices
})
