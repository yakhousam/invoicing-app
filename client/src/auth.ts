import * as authApi from '@/api/auth'
import { User } from '@/validations'

export interface Auth {
  isAuthenticated: boolean
  register: (username: string, password: string) => Promise<User>
  login: (username: string, password: string) => Promise<User>
  logout: () => Promise<void>
}

export const auth: Auth = {
  isAuthenticated: false,
  register: async function (username: string, password: string) {
    const user = await authApi.register(username, password)
    this.isAuthenticated = true
    return user
  },
  login: async function (username: string, password: string) {
    const user = await authApi.login(username, password)
    this.isAuthenticated = true
    return user
  },
  logout: async function () {
    this.isAuthenticated = false
    await authApi.logout()
  }
}
