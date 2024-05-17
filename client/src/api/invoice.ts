import { invoiceArraySchema, invoiceSchema } from '@/validations'
import { fetchApi } from './util'

export const fetchInvoices = async () => {
  const invoices = await fetchApi('/invoices')
  return invoiceArraySchema.parse(invoices) // Use invoiceArraySchema to parse the invoices
}

export const fetchInvoiceById = async (id: string) => {
  const invoice = await fetchApi(`/invoices/${id}`)
  return invoiceSchema.parse(invoice) // Use invoiceSchema to parse the invoice
}
