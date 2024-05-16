import { Menu as MenuIcon } from '@mui/icons-material'
import {
  IconButton,
  AppBar as MuiAppBar,
  AppBarProps as MuiAppBarProps,
  Toolbar,
  Typography
} from '@mui/material'
import { styled } from '@mui/material/styles'

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
  width: number
}

const StyledAppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})<AppBarProps>(({ theme, open, width }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    marginLeft: width,
    width: `calc(100% - ${width}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}))

const AppBar = ({
  children,
  open,
  handleDrawerOpen,
  title,
  drawerWidth
}: {
  children?: React.ReactNode
  open: boolean
  handleDrawerOpen: () => void
  title?: string
  drawerWidth: number
}) => {
  return (
    <StyledAppBar position="fixed" open={open} width={drawerWidth}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{
            marginRight: 5,
            ...(open && { display: 'none' })
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          {title}
        </Typography>
        {children}
      </Toolbar>
    </StyledAppBar>
  )
}

export default AppBar
