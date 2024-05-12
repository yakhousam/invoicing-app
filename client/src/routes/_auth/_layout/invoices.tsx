import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/_layout/invoices')({
  component: () => <div>Hello /_auth/invoices!</div>
})
