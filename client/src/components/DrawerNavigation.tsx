import { routeTree } from '@/routeTree.gen'
import {
  LineAxis as LineAxisIcon,
  People as PeopleIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material'
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { Link as RouterLink, RoutesByPath } from '@tanstack/react-router'
import React from 'react'

type RouterPath = keyof RoutesByPath<typeof routeTree>

type Link = {
  id: number
  label: string
  icon: React.ReactNode
  href: RouterPath
}

const links: Array<Link> = [
  { id: 1, label: 'Dashboard', icon: <LineAxisIcon />, href: '/' },
  { id: 2, label: 'Invoices', icon: <ReceiptIcon />, href: '/invoices' },
  { id: 3, label: 'Clients', icon: <PeopleIcon />, href: '/clients' }
]

const DrawerNavigation = ({ open }: { open: boolean }) => {
  const theme = useTheme()

  return (
    <List>
      {links.map(({ id, href, icon, label }) => (
        <ListItem
          key={id}
          disablePadding
          sx={{
            display: 'block',
            '& a': {
              color: 'inherit',
              textDecoration: 'none'
            },
            '& a.active': {
              '.MuiListItemButton-root': {
                color: theme.palette.primary.main
              },
              '.MuiListItemIcon-root': {
                color: (theme) => theme.palette.primary.main
              }
            }
          }}
        >
          <RouterLink to={href}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center'
                }}
              >
                {icon}
              </ListItemIcon>
              <ListItemText primary={label} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </RouterLink>
        </ListItem>
      ))}
    </List>
  )
}

export default DrawerNavigation
