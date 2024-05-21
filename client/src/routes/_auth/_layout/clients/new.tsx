import { Box, Typography } from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'
import ClientForm from './-components/ClientForm'

export const Route = createFileRoute('/_auth/_layout/clients/new')({
  component: NewClient
})

function NewClient() {
  return (
    <Box>
      <Typography component="h1" variant="h3">
        New Client
      </Typography>
      <ClientForm />
    </Box>
  )
}
