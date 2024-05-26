import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SnackbarProvider } from 'notistack'

const queryClient = new QueryClient()

export const QueryClientWrapper = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

export const NotistackWrapper = ({
  children
}: {
  children: React.ReactNode
}) => {
  return <SnackbarProvider>{children}</SnackbarProvider>
}
