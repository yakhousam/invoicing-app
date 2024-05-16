import { ChevronLeft as ChevronLeftIcon } from '@mui/icons-material'
import {
  Divider,
  IconButton,
  Drawer as MuiDrawer,
  DrawerProps as MuiDrawerProps
} from '@mui/material'
import { CSSObject, Theme, styled } from '@mui/material/styles'
import React from 'react'

interface DrawerProps extends MuiDrawerProps {
  open?: boolean
  width: number
}

const openedMixin = (theme: Theme, drawerWidth: number): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,

    duration: theme.transitions.duration.enteringScreen
  }),
  overflowX: 'hidden'
})

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`
  }
})

export const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar
}))

const StyledDrawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open'
})<DrawerProps>(({ theme, open, width }) => ({
  width: width,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme, width),
    '& .MuiDrawer-paper': openedMixin(theme, width)
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme)
  })
}))

const Drawer = ({
  children,
  open,
  handleDrawerClose,
  drawerWidth
}: {
  children: React.ReactNode
  open: boolean
  handleDrawerClose: () => void
  drawerWidth: number
}) => {
  return (
    <StyledDrawer variant="permanent" open={open} width={drawerWidth}>
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>
      <Divider />
      {children}
    </StyledDrawer>
  )
}

export default Drawer
