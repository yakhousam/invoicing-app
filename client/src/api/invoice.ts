import { invoiceArraySchema } from '@/validations'
import { fetchApi } from './util'

export const fetchInvoices = async () => {
  const invoices = await fetchApi('/invoices')
  return invoiceArraySchema.parse(invoices) // Use invoiceArraySchema to parse the invoices
}
