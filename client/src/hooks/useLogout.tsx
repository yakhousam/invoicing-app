import { useRouteContext } from '@tanstack/react-router'
import React from 'react'

const useLogout = () => {
  const { auth } = useRouteContext({ strict: false })
  const [status, setStatus] = React.useState<'idle' | 'pending' | 'error'>(
    'idle'
  )
  const handleLogout = async () => {
    try {
      setStatus('pending')
      await auth?.logout()
      window.location.href = `/login?redirect=${window.location.pathname}`
    } catch (error) {
      setStatus('error')
    }
  }
  return { status, handleLogout }
}

export default useLogout
