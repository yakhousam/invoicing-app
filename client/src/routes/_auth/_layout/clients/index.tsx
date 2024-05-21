import { Box, Typography } from '@mui/material'
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
    <Box>
      <Typography component="h1" variant="h3">
        Clients
      </Typography>
      <RouterLink to="/clients/new">Create Client</RouterLink>
      <ClientsTable />
    </Box>
  )
}
