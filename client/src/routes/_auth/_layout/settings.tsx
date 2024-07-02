import PasswordUpdate from '@/components/settings/PasswordUpdate'
import Signature from '@/components/settings/Signature'
import UserInfos from '@/components/settings/UserInfos'
import { Box, Paper } from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/_layout/settings')({
  beforeLoad: () => ({
    title: 'Settings'
  }),
  component: () => <Settings />
})

function Settings() {
  return (
    <>
      <Wrapper>
        <UserInfos />
      </Wrapper>
      <Box sx={{ mt: 4 }} />
      <Wrapper>
        <Signature />
      </Wrapper>
      <Box sx={{ mt: 4 }} />
      <Wrapper>
        <PasswordUpdate />
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
