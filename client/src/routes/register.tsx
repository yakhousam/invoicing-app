import RegisterForm from '@/components/register/RegisterForm'
import { userOptions } from '@/queries/user'
import { User } from '@/validations'
import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'

export const Route = createFileRoute('/register')({
  component: Register
})

function Register() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const onRegister = async (user: User) => {
    queryClient.setQueryData(userOptions.queryKey, user)
    await router.invalidate().finally(() => {
      router.navigate({
        to: '/settings'
      })
    })
  }
  return <RegisterForm onRegister={onRegister} />
}
