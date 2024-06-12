import { fetchSummary } from '@/api/dashboard'
import { fetchInvoiceById, fetchInvoices } from '@/api/invoice'
import { queryOptions } from '@tanstack/react-query'

export const invoicesOptions = queryOptions({
  queryKey: ['invoices'],
  queryFn: fetchInvoices
})

export const invoiceByIdOptions = (id: string) =>
  queryOptions({
    queryKey: ['invoice', id],
    queryFn: () => fetchInvoiceById(id)
  })

export const invoicesSummaryOptions = queryOptions({
  queryKey: ['summary'],
  queryFn: fetchSummary
})
