import { User } from '@/validations'
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
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

  const onLogin = (user: User) => {
    router.update({
      context: {
        ...router.options.context,
        auth: { ...router.options.context.auth, isAuthenticated: true, user }
      }
    })
    router.invalidate().finally(() =>
      router.navigate({
        to: '/'
      })
    )
  }

  return <LoginForm onLogin={onLogin} />
}
