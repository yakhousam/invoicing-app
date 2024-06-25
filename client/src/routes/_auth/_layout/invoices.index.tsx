import InvoicesTable from '@/components/invoice/Table'
import { invoicesOptions } from '@/queries'
import { invoicesSearchSchema } from '@/validations'
import AddIcon from '@mui/icons-material/Add'
import { Box, Button, Paper, Typography } from '@mui/material'
import { Link as RouterLink, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/_layout/invoices/')({
  validateSearch: invoicesSearchSchema,
  loaderDeps: ({ search }) => search,
  loader: ({ context: { queryClient }, deps }) =>
    queryClient.ensureQueryData(invoicesOptions(deps)),
  component: Invoices
})

function Invoices() {
  return (
    <Box
      sx={{
        maxWidth: (theme) => theme.breakpoints.values.lg,
        mx: 'auto',
        mt: 4
      }}
    >
      <Paper sx={{ p: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4
          }}
        >
          <Typography component="h1" variant="h4" fontWeight="bold">
            Invoices
          </Typography>

          <RouterLink to="/invoices/create">
            <Button variant="contained" startIcon={<AddIcon />}>
              New Invoice
            </Button>
          </RouterLink>
        </Box>
        <InvoicesTable />
      </Paper>
    </Box>
  )
}
