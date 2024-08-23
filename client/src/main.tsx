import * as Sentry from '@sentry/react'
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

Sentry.init({
  dsn: 'https://eb6f401e82cdd7d6e5e49d78db270251@o4507824956571648.ingest.de.sentry.io/4507824964042832',
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration()
  ],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0 // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
})

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
          autoHideDuration={3000}
        >
          <RouterProvider router={router} />
        </SnackbarProvider>
      </QueryClientProvider>
    </StrictMode>
  )
}
