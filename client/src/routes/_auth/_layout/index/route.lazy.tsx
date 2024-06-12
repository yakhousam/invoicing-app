import { Box, Grid, Paper } from '@mui/material'
import { createLazyFileRoute } from '@tanstack/react-router'
import InvoicesTable from '../invoices/-components/Table'
import { Summary } from './-components/Summary'

export const Route = createLazyFileRoute('/_auth/_layout/')({
  component: Dashboard
})

function Dashboard() {
  return (
    <Box
      sx={{
        maxWidth: (theme) => theme.breakpoints.values.xl,
        mx: 'auto',
        mt: 4
      }}
    >
      <Grid container>
        <Grid item xs={12} md={8}></Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4 }}>
            <Summary />
          </Paper>
        </Grid>
      </Grid>
      <Box mt={3}>
        <Paper sx={{ p: 4 }}>
          <InvoicesTable />
        </Paper>
      </Box>
    </Box>
  )
}
