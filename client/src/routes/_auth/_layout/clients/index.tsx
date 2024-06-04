import AddIcon from '@mui/icons-material/Add'
import { Box, Button, Paper, Typography } from '@mui/material'
import { Link as RouterLink, createFileRoute } from '@tanstack/react-router'
import ClientsTable from './-components/Table'
import { clientQueryOptions } from './-query-options/clientQueryOption'

export const Route = createFileRoute('/_auth/_layout/clients/')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(clientQueryOptions),
  component: Clients
})

function Clients() {
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
            Clients
          </Typography>

          <RouterLink to="/clients/create">
            <Button variant="contained" startIcon={<AddIcon />}>
              New Client
            </Button>
          </RouterLink>
        </Box>
        <ClientsTable />
      </Paper>
    </Box>
  )
}
