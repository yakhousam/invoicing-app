import { API_URL } from '@/config'
import { invoicesSummarySchema } from '@/validations'
import { fetchApi } from './util'

export const fetchSummary = async () => {
  const summary = await fetchApi(API_URL.dashboard.getSummary)
  return invoicesSummarySchema.parse(summary)
}

export const fetchTotalsByMonth = async () => {
  return await fetchApi(API_URL.dashboard.getTotalsByMonth)
}
