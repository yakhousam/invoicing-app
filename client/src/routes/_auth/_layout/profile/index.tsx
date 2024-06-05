import { useAuth } from '@/hooks/useAuth'
import { Typography } from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'
import ProfileForm from './-components/ProfileForm'

export const Route = createFileRoute('/_auth/_layout/profile/')({
  component: () => <Profile />
})

function Profile() {
  const { user, setUser } = useAuth()
  if (!user) return <Typography variant="h4">Loading...</Typography>
  return <ProfileForm user={user} onUpdateUser={setUser} />
}
