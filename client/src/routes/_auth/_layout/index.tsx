import { Chart } from '@/components/dashboard/Chart'
import DashboardTable from '@/components/dashboard/DashboardTable'
import { Summary } from '@/components/dashboard/Summary'
import { Box, Grid, Paper, Typography } from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/_layout/')({
  beforeLoad: () => ({
    title: 'Dashboard'
  }),
  component: Dashboard
})

function Dashboard() {
  return (
    <Box
      sx={{
        maxWidth: (theme) => theme.breakpoints.values.lg,
        mx: 'auto',
        mt: 4
      }}
    >
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Dashboard
      </Typography>
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
          <DashboardTable />
        </Paper>
      </Box>
    </Box>
  )
}
