import { Box, Typography } from '@mui/material'
import { Link, createFileRoute } from '@tanstack/react-router'
import InvoicesTable from './-components/Table'

export const Route = createFileRoute('/_auth/_layout/invoices/')({
  component: Invoices
})

function Invoices() {
  return (
    <Box>
      <Link to="/invoices/create">Create Invoice</Link>
      <Typography component="h1" variant="h3">
        Invoices
      </Typography>
      <InvoicesTable />
    </Box>
  )
}
