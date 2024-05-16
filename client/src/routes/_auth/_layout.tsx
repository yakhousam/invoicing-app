import AppBar from '@/components/AppBar'
import Breadcrumbs from '@/components/Breadcrumbs'
import Drawer, { DrawerHeader } from '@/components/Drawer'
import DrawerNavigation from '@/components/DrawerNavigation'
import useLogout from '@/hooks/useLogout'

import { Box, Button, CssBaseline } from '@mui/material'
import { Outlet, createFileRoute, useRouter } from '@tanstack/react-router'
import React from 'react'

export const Route = createFileRoute('/_auth/_layout')({
  component: Layout
})

const drawerWidth = 240

function Layout() {
  const router = useRouter()

  const [open, setOpen] = React.useState(false)

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  const pathList =
    router.state.matches.at(-1)?.pathname.split('/').filter(Boolean) ?? []

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        handleDrawerOpen={handleDrawerOpen}
        open={open}
        drawerWidth={drawerWidth}
      >
        <Box ml="auto">
          <LogoutButton />
        </Box>
      </AppBar>
      <Drawer
        open={open}
        drawerWidth={drawerWidth}
        handleDrawerClose={handleDrawerClose}
      >
        <DrawerNavigation open={open} />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Breadcrumbs pathList={pathList} />
        <Outlet />
      </Box>
    </Box>
  )
}

const LogoutButton = () => {
  const { handleLogout } = useLogout()
  return (
    <Button variant="contained" color="secondary" onClick={handleLogout}>
      Logout
    </Button>
  )
}
