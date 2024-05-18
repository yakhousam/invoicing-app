import * as api from '@/api/auth'
import { useAuth } from '@/auth'
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import React from 'react'
import LoginForm from './-components/LoginForm'

export const Route = createFileRoute('/login')({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: '/' })
    }
  },
  component: LoginPage
})

function LoginPage() {
  const [error, setError] = React.useState<string | null>(null)
  const router = useRouter()
  const auth = useAuth()

  const handleSubmit = async ({
    username,
    password
  }: {
    username: string
    password: string
  }) => {
    try {
      setError(null)
      const user = await api.login(username, password)
      auth.setUser(user)
      router.update({
        context: {
          ...router.options.context,
          auth: { ...router.options.context.auth, isAuthenticated: true, user }
        }
      })
      router.invalidate().finally(() => router.navigate({ to: '/' }))
    } catch (error) {
      setError('Invalid username or password')
    }
  }

  return <LoginForm handleSubmit={handleSubmit} submitError={error} />
}
