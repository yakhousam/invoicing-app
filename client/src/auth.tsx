import * as api from '@/api/auth'
import { fetchCurrentUser } from '@/api/user'
import { User } from '@/validations'
import React, { useEffect } from 'react'

export type AuthContextType = {
  isAuthenticated: boolean
  user: User | null
  logout: () => Promise<void>
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  isFetching: boolean
}

export const AuthContext = React.createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null)
  const [isFetching, setIsFetching] = React.useState(true)

  const isAuthenticated = Boolean(user)

  const isMounted = React.useRef(false)

  useEffect(() => {
    if (isMounted.current) {
      return
    }
    isMounted.current = true
    fetchCurrentUser()
      .then(setUser)
      .catch(console.error)
      .finally(() => setIsFetching(false))
  }, [])

  const contextValue = {
    isFetching,
    isAuthenticated,
    user,
    setUser,
    logout: async () => {
      setUser(null)
      await api.logout()
    }
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}
