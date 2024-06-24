import { Box, Grid, Paper } from '@mui/material'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Chart } from './-components/Chart'
import DashboardTable from './-components/DashboardTable'
import { Summary } from './-components/Summary'

export const Route = createLazyFileRoute('/_auth/_layout/')({
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
