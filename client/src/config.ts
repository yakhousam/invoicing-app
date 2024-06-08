export const apiUrl = import.meta.env.VITE_APP_API_URL as string

const url = new URL('http://localhost:3005/api/v1')
export const baseUrl = `${url.protocol}//${url.host}`

export const API_URL = {
  auth: {
    login: `${apiUrl}/auth/signin`,
    logout: `${apiUrl}/auth/signout`
  },
  clients: {
    createOne: `${apiUrl}/clients`,
    deleteOne: (id: string) => `${apiUrl}/clients/${id}`,
    getMany: `${apiUrl}/clients`,
    getOne: (id: string) => `${apiUrl}/clients/${id}`,
    updateOne: (id: string) => `${apiUrl}/clients/${id}`
  },
  users: {
    createOne: `${apiUrl}/users`,
    deleteOne: (id: string) => `${apiUrl}/users/${id}`,
    getOne: `${apiUrl}/users`,
    getProfile: `${apiUrl}/users/me`,
    updateProfile: (id: string) => `${apiUrl}/users/${id}/profile`,
    updateSignature: (id: string) => `${apiUrl}/users/${id}/signature`,
    updatePassword: (id: string) => `${apiUrl}/users/${id}/password`
  },
  invoices: {
    createOne: `${apiUrl}/invoices`,
    deleteOne: (id: string) => `${apiUrl}/invoices/${id}`,
    getMany: `${apiUrl}/invoices`,
    getOne: (id: string) => `${apiUrl}/invoices/${id}`,
    updateOne: (id: string) => `${apiUrl}/invoices/${id}`
  }
} as const
