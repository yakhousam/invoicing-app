import * as api from '@/api/auth'
import { fetchCurrentUser } from '@/api/user'
import { User } from '@/validations'
import React from 'react'

export type AuthContextType = {
  isAuthenticated: boolean
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  logout: () => Promise<void>
  login: (username: string, password: string) => Promise<User>
  getUser: () => Promise<User>
}

export const AuthContext = React.createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null)

  const isAuthenticated = Boolean(user)

  const contextValue = {
    isAuthenticated,
    user,
    setUser,
    getUser: async () => {
      if (user !== null) {
        return user
      }
      const _user = await fetchCurrentUser()
      setUser(_user)
      return _user
    },
    login: async (username: string, password: string) => {
      const user = await api.login(username, password)
      setUser(user)
      return user
    },
    logout: async () => {
      setUser(null)
      await api.logout()
    }
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}
