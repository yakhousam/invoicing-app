import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/_layout/invoices/$id')({
  component: () => <div>hello </div>
})
