import { useAuth } from '@/hooks/useAuth'
import { useQueryClient } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import router from './router'

function App() {
  const auth = useAuth()
  const queryClient = useQueryClient()

  return (
    <RouterProvider
      router={router}
      context={{ auth, queryClient }}
      defaultStaleTime={0}
    />
  )
}

export default App
