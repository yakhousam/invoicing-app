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
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: '/' })
    }
  },
  component: LoginPage
})

function LoginPage() {
  const router = useRouter()
  const search = Route.useSearch()
  const auth = useAuth()
  const onLogin = (user: User) => {
    auth.setUser(user)
    // I need to update the context to set the user as authenticated before navigating
    router.update({
      context: {
        ...router.options.context,
        auth: { ...auth, isAuthenticated: true, user }
      }
    })
    router.invalidate().finally(() =>
      router.navigate({
        to: search.redirect || fallback,
        search: undefined
      })
    )
  }

  return <LoginForm onLogin={onLogin} />
}
