import * as api from '@/api/auth'
import { fetchUser } from '@/api/user'
import { User } from '@/validations'
import React, { useEffect } from 'react'

export type AuthContextType = {
  isAuthenticated: boolean
  user: User | null
  logout: () => Promise<void>
  setUser: (user: User) => void
  isFetching: boolean
}

const AuthContext = React.createContext<AuthContextType | null>(null)

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
    fetchUser()
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

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
