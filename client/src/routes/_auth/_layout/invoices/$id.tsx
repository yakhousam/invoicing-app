import { Box, Paper, Stack, Typography } from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'
import InvoiceByIdForm from './-components/invoiceByIdForm'
import { invoiceByIdQueryOption } from './-query-options/invoiceByIdQueryOption'

export const Route = createFileRoute('/_auth/_layout/invoices/$id')({
  beforeLoad: () => ({
    title: 'Invoice'
  }),
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(invoiceByIdQueryOption(params.id)),
  component: Invoice
})

function Invoice() {
  return (
    <Stack spacing={4} mt={4}>
      <Typography variant="h4">Invoice</Typography>
      <Box
        sx={{
          width: (theme) => theme.breakpoints.values.lg,
          maxWidth: '100%',
          alignSelf: 'center'
        }}
      >
        <Paper sx={{ p: 4 }}>
          <InvoiceByIdForm />
        </Paper>
      </Box>
    </Stack>
  )
}
