import { fetchInvoiceById } from '@/api/invoice'
import { queryOptions } from '@tanstack/react-query'

export const invoiceByIdQueryOption = (id: string) =>
  queryOptions({
    queryKey: ['invoice', id],
    queryFn: () => fetchInvoiceById(id)
  })
