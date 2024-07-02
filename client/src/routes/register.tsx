import RegisterForm from '@/components/register/RegisterForm'
import { createFileRoute, useRouter } from '@tanstack/react-router'

export const Route = createFileRoute('/register')({
  component: Register
})

function Register() {
  const router = useRouter()
  const onRegister = async () => {
    await router.invalidate().finally(() => {
      router.navigate({
        to: '/'
      })
    })
  }
  return <RegisterForm onRegister={onRegister} />
}
