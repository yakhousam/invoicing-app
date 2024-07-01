import ClientEdit from '@/components/client/ClientEdit'
import { Box, Paper, Stack } from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/_layout/clients/$id')({
  beforeLoad: () => ({
    title: 'Client'
  }),

  component: Client
})

function Client() {
  return (
    <Stack spacing={4} mt={4}>
      <Box
        sx={{
          width: (theme) => theme.breakpoints.values.lg,
          maxWidth: '100%',
          alignSelf: 'center'
        }}
      >
        <Paper sx={{ p: 4 }}>
          <ClientEdit />
        </Paper>
      </Box>
    </Stack>
  )
}
