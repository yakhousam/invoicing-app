import { API_URL } from '@/config'
import {
  invoicesSummarySchema,
  invoicesTotalsByMonthSchema
} from '@/validations'
import { fetchApi } from './util'

export const fetchSummary = async () => {
  const summary = await fetchApi(API_URL.dashboard.getSummary)
  return invoicesSummarySchema.parse(summary)
}

export const fetchTotalsByMonth = async () => {
  const totals = await fetchApi(API_URL.dashboard.getTotalsByMonth)
  return invoicesTotalsByMonthSchema.parse(totals)
}
