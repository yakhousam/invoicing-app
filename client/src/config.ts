export const apiUrl =
  (import.meta.env.VITE_APP_API_URL as string) || 'http://localhost:3005/api/v1'

const url = new URL(apiUrl)
export const baseUrl = `${url.protocol}//${url.host}`

export const API_URL = {
  auth: {
    login: `${apiUrl}/auth/login`,
    logout: `${apiUrl}/auth/logout`
  },
  clients: {
    createOne: `${apiUrl}/clients`,
    deleteOne: (id: string) => `${apiUrl}/clients/${id}`,
    getMany: `${apiUrl}/clients`,
    getOne: (id: string) => `${apiUrl}/clients/${id}`,
    updateOne: (id: string) => `${apiUrl}/clients/${id}`
  },
  users: {
    getProfile: `${apiUrl}/users/me`,
    updateProfile: `${apiUrl}/users/me/profile`,
    updateSignature: `${apiUrl}/users/me/signature`,
    updatePassword: `${apiUrl}/users/me/password`
  },
  invoices: {
    createOne: `${apiUrl}/invoices/me`,
    deleteOne: (id: string) => `${apiUrl}/invoices/me/${id}`,
    getMany: `${apiUrl}/invoices/me`,
    getOne: (id: string) => `${apiUrl}/invoices/me/${id}`,
    updateOne: (id: string) => `${apiUrl}/invoices/me/${id}`
  },
  dashboard: {
    getSummary: `${apiUrl}/invoices/me/summary`,
    getTotalsByMonth: `${apiUrl}/invoices/me/totals-by-month`
  }
} as const
