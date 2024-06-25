import ClientForm from '@/components/client/ClientForm'
import { Box, Paper, Typography } from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/_layout/clients/create')({
  component: NewClient
})

function NewClient() {
  return (
    <Box
      sx={{
        maxWidth: (theme) => theme.breakpoints.values.sm,
        mx: 'auto',
        mt: 4
      }}
    >
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Add New Client
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Enter the details of your new client below
        </Typography>
        <Box sx={{ mt: 4 }} />

        <ClientForm />
      </Paper>
    </Box>
  )
}
