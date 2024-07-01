import PasswordUpdate from '@/components/settings/PasswordUpdate'
import Signature from '@/components/settings/Signature'
import UserInfos from '@/components/settings/UserInfos'
import { useAuth } from '@/hooks/useAuth'
import useLogout from '@/hooks/useLogout'
import { Box, Paper, Typography } from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/_layout/settings')({
  beforeLoad: () => ({
    title: 'Settings'
  }),
  component: () => <Settings />
})

function Settings() {
  const { user, setUser } = useAuth()
  const { handleLogout } = useLogout()

  if (!user) return <Typography variant="h4">Loading...</Typography>
  return (
    <>
      <Wrapper>
        <UserInfos user={user} onUpdateUser={setUser} />
      </Wrapper>
      <Box sx={{ mt: 4 }} />
      <Wrapper>
        <Signature user={user} onUpdateSignature={setUser} />
      </Wrapper>
      <Box sx={{ mt: 4 }} />
      <Wrapper>
        <PasswordUpdate onUpdatePassword={handleLogout} />
      </Wrapper>
    </>
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
