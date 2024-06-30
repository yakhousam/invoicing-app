import LoginForm from '@/components/login/LoginForm'
import { useAuth } from '@/hooks/useAuth'
import { User } from '@/validations'
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { z } from 'zod'

const fallback = '/' as const

export const Route = createFileRoute('/login')({
  validateSearch: z.object({
    redirect: z.string().optional()
  }),
  beforeLoad: async ({ context, search }) => {
    let user = null
    try {
      user = await context.auth.getUser()
      context.auth.isAuthenticated = true
    } catch (error) {
      console.error(error)
    }
    if (user) {
      throw redirect({
        to: search.redirect || fallback
      })
    }
  },
  component: LoginPage
})

function LoginPage() {
  const auth = useAuth()
  const router = useRouter()
  const search = Route.useSearch()
  const onLogin = async (user: User) => {
    router.update({
      context: {
        auth: {
          ...auth,
          user,
          isAuthenticated: true
        }
      }
    })
    await router.navigate({
      to: search.redirect || fallback
    })
  }
  if (auth.isAuthenticated) return null
  return <LoginForm onLogin={onLogin} />
}
