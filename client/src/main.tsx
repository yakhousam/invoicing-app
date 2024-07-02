import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  ErrorComponent,
  RouterProvider,
  createRouter
} from '@tanstack/react-router'
import { SnackbarProvider } from 'notistack'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { auth } from './auth'
import { Spinner } from './components/spinner'
import { routeTree } from './routeTree.gen'

const queryClient = new QueryClient()

const router = createRouter({
  routeTree,
  defaultPendingComponent: Spinner,
  defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
  context: {
    queryClient,
    auth
  },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0
})
// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <SnackbarProvider
          anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        >
          <RouterProvider router={router} />
        </SnackbarProvider>
      </QueryClientProvider>
    </StrictMode>
  )
}
