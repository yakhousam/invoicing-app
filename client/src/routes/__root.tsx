import { Auth } from '@/auth'
import { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import React, { Suspense } from 'react'

interface RouteContext {
  queryClient: QueryClient
  auth: Auth
  title?: string
}

const TanStackRouterDevtools =
  process.env.NODE_ENV === 'production'
    ? () => null // Render nothing in production
    : React.lazy(() =>
        // Lazy load in development
        import('@tanstack/router-devtools').then((res) => ({
          default: res.TanStackRouterDevtools
          // For Embedded Mode
          // default: res.TanStackRouterDevtoolsPanel
        }))
      )

export const Route = createRootRouteWithContext<RouteContext>()({
  component: () => (
    <>
      <Outlet />
      <ReactQueryDevtools buttonPosition="bottom-right" />
      <Suspense>
        <TanStackRouterDevtools position="bottom-left" />
      </Suspense>
    </>
  )
})
