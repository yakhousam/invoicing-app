export const baseUrl: string = import.meta.env.VITE_APP_API_URL

export const API_URL = {
  auth: {
    login: '/auth/signin',
    logout: '/auth/signout'
  },
  clients: {
    createOne: '/clients',
    deleteOne: (id: string) => `/clients/${id}`,
    getMany: '/clients',
    getOne: (id: string) => `/clients/${id}`,
    updateOne: (id: string) => `/clients/${id}`
  },
  users: {
    createOne: '/users',
    deleteOne: (id: string) => `/users/${id}`,
    getOne: '/users',
    updateOne: (id: string) => `/users/${id}`,
    getProfile: '/users/me'
  },
  invoices: {
    createOne: '/invoices',
    deleteOne: (id: string) => `/invoices/${id}`,
    getMany: '/invoices',
    getOne: (id: string) => `/invoices/${id}`,
    update: (id: string) => `/invoices/${id}`
  }
}
