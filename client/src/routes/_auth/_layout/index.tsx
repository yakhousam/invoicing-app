import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/_layout/')({
  loader: () => {
    throw redirect({
      to: '/dashboard',
      replace: true
    })
  }
})
