import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  beforeLoad: async ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      try {
        await context.auth.getUser()
      } catch (error) {
        throw redirect({
          to: '/login',
          search: { redirect: location.href }
        })
      }
    }
  }
})
