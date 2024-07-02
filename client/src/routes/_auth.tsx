import { userOptions } from '@/queries/user'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  beforeLoad: async ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      try {
        await context.queryClient.ensureQueryData(userOptions)
        return {
          ...context,
          auth: {
            ...context.auth,
            isAuthenticated: true
          }
        }
      } catch (error) {
        throw redirect({
          to: '/login',
          search: { redirect: location.href }
        })
      }
    }
  }
})
