import { createFileRoute } from '@tanstack/react-router'

import { clientsOptions } from '@/queries'
import { Box, Paper, Typography } from '@mui/material'
import CreateInvoiceForm from '../../../components/invoice/CreateInvoiceForm'

export const Route = createFileRoute('/_auth/_layout/invoices/create')({
  loader: ({ context }) => context.queryClient.ensureQueryData(clientsOptions),
  component: CreateInvoice
})

function CreateInvoice() {
  return (
    <Box
      sx={{
        maxWidth: (theme) => theme.breakpoints.values.sm,
        margin: 'auto'
      }}
    >
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Create a new invoice
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Fill out the form below to create a new invoice.
        </Typography>
        <Box sx={{ mt: 4 }} />
        <CreateInvoiceForm />
      </Paper>
    </Box>
  )
}
