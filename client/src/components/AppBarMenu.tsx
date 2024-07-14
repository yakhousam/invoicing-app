import useLogout from '@/hooks/useLogout'
import { userOptions } from '@/queries/user'
import { LogoutRounded, Settings } from '@mui/icons-material'
import {
  Avatar,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem
} from '@mui/material'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Link as RouterLink } from '@tanstack/react-router'
import React from 'react'

const AppBarMenu = () => {
  const { data: user } = useSuspenseQuery(userOptions)

  const { handleLogout, status } = useLogout()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <div>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <Avatar sx={{ textTransform: 'uppercase' }}>{user?.userName[0]}</Avatar>
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{ '& a': { textDecoration: 'none', color: 'inherit' } }}
      >
        <RouterLink to="/settings">
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </MenuItem>
        </RouterLink>
        <Divider />
        <MenuItem
          aria-label="logout"
          onClick={async () => {
            await handleLogout()
            handleClose()
          }}
          disabled={status === 'pending'}
        >
          <ListItemIcon>
            <LogoutRounded fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Menu>
    </div>
  )
}

export default AppBarMenu
