import { API_URL } from '@/config'
import {
  CreateInvoice,
  invoiceArraySchema,
  invoiceSchema,
  UpdateInvoice
} from '@/validations'
import { fetchApi } from './util'

export const fetchInvoices = async () => {
  const invoices = await fetchApi(API_URL.invoices.getMany)
  return invoiceArraySchema.parse(invoices) // Use invoiceArraySchema to parse the invoices
}

export const fetchInvoiceById = async (id: string) => {
  const invoice = await fetchApi(API_URL.invoices.getOne(id))
  return invoiceSchema.parse(invoice) // Use invoiceSchema to parse the invoice
}

export const createInvoice = async (data: CreateInvoice) => {
  const invoice = await fetchApi(API_URL.invoices.createOne, {
    method: 'POST',
    body: JSON.stringify(data)
  })
  return invoiceSchema.parse(invoice) // Use invoiceSchema to parse the invoice
}

export const updateInvoice = async (id: string, data: UpdateInvoice) => {
  const invoice = await fetchApi(API_URL.invoices.updateOne(id), {
    method: 'PUT',
    body: JSON.stringify(data)
  })
  return invoiceSchema.parse(invoice) // Use invoiceSchema to parse the invoice
}
