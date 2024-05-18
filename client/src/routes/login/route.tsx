import * as api from '@/api/auth'
import { useAuth } from '@/auth'
import { Spinner } from '@/components/spinner'
import { Box } from '@mui/material'
import {
  createFileRoute,
  redirect,
  useMatchRoute,
  useRouter
} from '@tanstack/react-router'
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
  const router = useRouter()
  const matchRoute = useMatchRoute()
  const auth = useAuth()

  const handleSubmit = async ({
    username,
    password
  }: {
    username: string
    password: string
  }) => {
    const user = await api.login(username, password)
    auth.setUser(user)
    router.update({
      context: {
        ...router.options.context,
        auth: { ...router.options.context.auth, isAuthenticated: true, user }
      }
    })
    router.invalidate().finally(() => router.navigate({ to: '/' }))
  }

  if (matchRoute({ to: '/', pending: true })) {
    return (
      <Box
        height="80vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Spinner />
      </Box>
    )
  }

  return <LoginForm onSubmit={handleSubmit} />
}
