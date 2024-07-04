import { auth } from '@/auth'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  Outlet,
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter
} from '@tanstack/react-router'
import { render } from '@testing-library/react'
import { ReactNode } from 'react'

const queryClient = new QueryClient()

export function renderWithContext({
  component,
  path = '/',
  initialEntries = [path],
  isAuthenticated = false
}: {
  component: ReactNode
  path?: string
  initialEntries?: string[]
  isAuthenticated?: boolean
}) {
  const rootRoute = createRootRoute({
    component: Outlet
  })

  const componentRoute = createRoute({
    getParentRoute: () => rootRoute,
    path,
    component: () => (
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    )
  })

  const router = createRouter({
    routeTree: rootRoute.addChildren([componentRoute]),
    history: createMemoryHistory({
      initialEntries
    }),
    context: {
      queryClient,
      auth: {
        ...auth,
        isAuthenticated
      }
    }
  })
  // @ts-expect-error This error occurs because of the declaration in main.tsx
  return render(<RouterProvider router={router} />)
}
