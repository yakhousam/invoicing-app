import { Box, Paper, Typography } from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'
import UserInfos from './-components/UserInfos'

export const Route = createFileRoute('/_auth/_layout/settings/')({
  component: () => <Settings />
})

function Settings() {
  const {
    auth: { user, setUser }
  } = Route.useRouteContext()
  if (!user) return <Typography variant="h4">Loading...</Typography>
  return (
    <Wrapper>
      <UserInfos user={user} onUpdateUser={setUser} />
    </Wrapper>
  )
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        maxWidth: (theme) => theme.breakpoints.values.sm,
        margin: 'auto'
      }}
    >
      <Paper sx={{ px: 4, py: 2 }}>{children}</Paper>
    </Box>
  )
}
