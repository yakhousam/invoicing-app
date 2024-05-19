import { User } from '@/validations'
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { z } from 'zod'
import LoginForm from './-components/LoginForm'

const fallback = '/' as const

export const Route = createFileRoute('/login')({
  validateSearch: z.object({
    redirect: z.string().optional().catch('')
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

  const onLogin = (user: User) => {
    // I need to update the context to set the user as authenticated before navigating
    router.update({
      context: {
        ...router.options.context,
        auth: { ...router.options.context.auth, isAuthenticated: true, user }
      }
    })
    router.invalidate().finally(() =>
      router.navigate({
        to: search.redirect || fallback
      })
    )
  }

  return <LoginForm onLogin={onLogin} />
}
