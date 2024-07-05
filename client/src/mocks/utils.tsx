import { auth } from '@/auth'
import { routeTree } from '@/routeTree.gen'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  Outlet,
  RouterProvider,
  RoutesByPath,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter
} from '@tanstack/react-router'
import { render } from '@testing-library/react'
import { SnackbarProvider } from 'notistack'
import { ReactNode } from 'react'

type RouterPath = keyof RoutesByPath<typeof routeTree>

const queryClient = new QueryClient()

export function renderWithContext({
  component,
  path = '/',
  initialEntries = [path],
  isAuthenticated = false
}: {
  component: ReactNode
  path: RouterPath
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
        <SnackbarProvider>{component}</SnackbarProvider>
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
