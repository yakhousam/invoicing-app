export const baseUrl = import.meta.env.VITE_APP_API_URL as string

export const API_URL = {
  auth: {
    login: `${baseUrl}/auth/signin`,
    logout: `${baseUrl}/auth/signout`
  },
  clients: {
    createOne: `${baseUrl}/clients`,
    deleteOne: (id: string) => `${baseUrl}/clients/${id}`,
    getMany: `${baseUrl}/clients`,
    getOne: (id: string) => `${baseUrl}/clients/${id}`,
    updateOne: (id: string) => `${baseUrl}/clients/${id}`
  },
  users: {
    createOne: `${baseUrl}/users`,
    deleteOne: (id: string) => `${baseUrl}/users/${id}`,
    getOne: `${baseUrl}/users`,
    updateOne: (id: string) => `${baseUrl}/users/${id}`,
    getProfile: `${baseUrl}/users/me`
  },
  invoices: {
    createOne: `${baseUrl}/invoices`,
    deleteOne: (id: string) => `${baseUrl}/invoices/${id}`,
    getMany: `${baseUrl}/invoices`,
    getOne: (id: string) => `${baseUrl}/invoices/${id}`,
    updateOne: (id: string) => `${baseUrl}/invoices/${id}`
  }
} as const
