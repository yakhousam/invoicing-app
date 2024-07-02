import { Auth } from '@/auth'
import { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

interface RouteContext {
  queryClient: QueryClient
  auth: Auth
  title?: string
}

export const Route = createRootRouteWithContext<RouteContext>()({
  component: () => (
    <>
      <Outlet />
      <ReactQueryDevtools buttonPosition="bottom-right" />
      <TanStackRouterDevtools position="bottom-left" />
    </>
  )
})
