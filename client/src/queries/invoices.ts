import { fetchInvoiceById, fetchInvoices } from '@/api/invoice'
import { InvoicesSearchParams } from '@/validations'
import { queryOptions } from '@tanstack/react-query'

export const invoicesOptions = (
  search: InvoicesSearchParams | undefined = {}
) =>
  queryOptions({
    queryKey: ['invoices', search],
    queryFn: () => fetchInvoices(search)
  })

export const invoiceByIdOptions = (id: string) =>
  queryOptions({
    queryKey: ['invoice', id],
    queryFn: () => fetchInvoiceById(id)
  })
