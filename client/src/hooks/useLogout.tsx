import { useAuth } from '@/hooks/useAuth'
import { useRouter } from '@tanstack/react-router'
import React from 'react'

const useLogout = () => {
  const auth = useAuth()
  const router = useRouter()
  const [status, setStatus] = React.useState<'idle' | 'pending' | 'error'>(
    'idle'
  )
  const handleLogout = async () => {
    try {
      setStatus('pending')
      await auth.logout()
      router.navigate({ to: '/login' })
      setStatus('idle')
    } catch (error) {
      setStatus('error')
    }
  }
  return { status, handleLogout }
}

export default useLogout
