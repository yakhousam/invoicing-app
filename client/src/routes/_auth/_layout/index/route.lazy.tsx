import { createLazyFileRoute } from '@tanstack/react-router'
import DashboardTable from './-components/Table'

export const Route = createLazyFileRoute('/_auth/_layout/')({
  component: Dashboard
})

function Dashboard() {
  return <DashboardTable />
}
