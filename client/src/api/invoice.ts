import { API_URL } from '@/config'
import {
  CreateInvoice,
  invoiceArraySchema,
  invoiceSchema,
  InvoicesSearchParams,
  invoicesSearchSchema,
  UpdateInvoice
} from '@/validations'
import { fetchApi } from './util'

export const fetchInvoices = async (search: InvoicesSearchParams) => {
  const parsedSearch = invoicesSearchSchema.parse(search) // Use invoicesSearchSchema to parse the search
  const searchParams = {
    ...parsedSearch,
    page: parsedSearch.page.toString(),
    limit: parsedSearch.limit.toString()
  }
  const result = await fetchApi(
    `${API_URL.invoices.getMany}?${new URLSearchParams(searchParams).toString()}`
  )
  return {
    invoices: invoiceArraySchema.parse(result.invoices), // Use invoiceArraySchema to parse the invoices
    totalInvoices: result.totalInvoices as number
  }
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

export const deleteInvoice = async (id: string) => {
  await fetchApi(API_URL.invoices.deleteOne(id), {
    method: 'DELETE'
  })
}
