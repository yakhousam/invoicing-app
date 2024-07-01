import AppBar from '@/components/AppBar'
import AppBarMenu from '@/components/AppBarMenu'
import Breadcrumbs from '@/components/Breadcrumbs'
import Drawer, { DrawerHeader } from '@/components/Drawer'
import DrawerNavigation from '@/components/DrawerNavigation'

import { Box, CssBaseline } from '@mui/material'
import { Outlet, createFileRoute } from '@tanstack/react-router'
import React from 'react'

export const Route = createFileRoute('/_auth/_layout')({
  component: Layout
})

const drawerWidth = 240

function Layout() {
  const [open, setOpen] = React.useState(true)

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        handleDrawerOpen={handleDrawerOpen}
        open={open}
        drawerWidth={drawerWidth}
      >
        <Box ml="auto">
          <AppBarMenu />
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
        <Breadcrumbs />
        <Outlet />
      </Box>
    </Box>
  )
}
