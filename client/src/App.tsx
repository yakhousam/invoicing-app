import { useAuth } from '@/hooks/useAuth'
import { Box } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import { Spinner } from './components/spinner'
import router from './router'

function App() {
  const auth = useAuth()
  const queryClient = useQueryClient()
  if (auth.isFetching) {
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
  return (
    <RouterProvider
      router={router}
      context={{ auth, queryClient }}
      defaultStaleTime={0}
    />
  )
}

export default App
