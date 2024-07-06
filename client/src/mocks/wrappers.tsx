import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SnackbarProvider } from 'notistack'

const queryClient = new QueryClient()

export const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <SnackbarProvider>{children}</SnackbarProvider>
  </QueryClientProvider>
)
