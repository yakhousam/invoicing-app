import { Chart } from '@/components/dashboard/Chart'
import DashboardTable from '@/components/dashboard/DashboardTable'
import { Summary } from '@/components/dashboard/Summary'
import { invoicesOptions } from '@/queries'
import { Box, Grid, Paper } from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/_layout/')({
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(invoicesOptions())
  },
  component: Dashboard
})

function Dashboard() {
  const data = Route.useLoaderData()
  return (
    <Box
      sx={{
        maxWidth: (theme) => theme.breakpoints.values.xl,
        mx: 'auto',
        mt: 4
      }}
    >
      <Grid container>
        <Grid item xs={12} md={8} px={2} minHeight={500}>
          <Chart />
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4 }}>
            <Summary />
          </Paper>
        </Grid>
      </Grid>
      <Box mt={3}>
        <Paper sx={{ p: 4 }}>
          <DashboardTable data={data.invoices} />
        </Paper>
      </Box>
    </Box>
  )
}
