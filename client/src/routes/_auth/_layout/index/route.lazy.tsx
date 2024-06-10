import { createLazyFileRoute } from '@tanstack/react-router'
import InvoicesTable from '../invoices/-components/Table'

export const Route = createLazyFileRoute('/_auth/_layout/')({
  component: Dashboard
})

function Dashboard() {
  return <InvoicesTable enablePagination={false} enableSorting={false} />
}
