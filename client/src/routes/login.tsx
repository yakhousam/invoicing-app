import LoginForm from '@/components/login/LoginForm'
import { userOptions } from '@/queries/user'
import { User } from '@/validations'
import { useQueryClient } from '@tanstack/react-query'
import { Navigate, createFileRoute, useRouter } from '@tanstack/react-router'
import { z } from 'zod'

const fallback = '/' as const

export const Route = createFileRoute('/login')({
  validateSearch: z.object({
    redirect: z.string().optional()
  }),
  beforeLoad: async ({ context, search }) => {
    if (search.redirect) {
      return {
        ...context,
        auth: {
          ...context.auth,
          isAuthenticated: false
        }
      }
    }

    try {
      await context.queryClient.ensureQueryData(userOptions)
      return {
        ...context,
        auth: {
          ...context.auth,
          isAuthenticated: true
        }
      }
    } catch (error) {
      console.error(error)
    }
  },

  component: LoginPage
})

function LoginPage() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const search = Route.useSearch()
  const routeContext = Route.useRouteContext()

  const onLogin = async (user: User) => {
    queryClient.setQueryData(userOptions.queryKey, user)
    await router.invalidate().finally(() => {
      router.navigate({
        to: search.redirect || fallback
      })
    })
  }
  if (routeContext.auth.isAuthenticated) {
    return <Navigate to={search.redirect || fallback} />
  }
  return <LoginForm onLogin={onLogin} />
}
