import { Spinner } from '@/components/spinner'
import {
  ErrorComponent,
  RoutesByPath,
  createRouter
} from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

// Create a new router instance
const router = createRouter({
  routeTree,
  defaultPendingComponent: Spinner,
  defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
  context: {
    queryClient: undefined!,
    auth: undefined!
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

export default router

export type RoutesPath = keyof RoutesByPath<typeof routeTree>
