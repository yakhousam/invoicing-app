import { Breadcrumbs as MuiBreadcrumbs, Typography } from '@mui/material'
import { Link as RouterLink, useRouter } from '@tanstack/react-router'

const Breadcrumbs = () => {
  const router = useRouter()
  const pathList = router.state.matches
    .at(-1)
    ?.pathname.split('/')
    .filter(Boolean)

  if (!pathList) {
    return null
  }

  if (pathList.length < 1) {
    return <Typography>Dashboard</Typography>
  }

  return (
    <MuiBreadcrumbs
      sx={{
        '& a': {
          textDecoration: 'none',
          color: 'inherit'
        },
        '& a:hover': {
          textDecoration: 'underline'
        }
      }}
    >
      <RouterLink to="/">
        <Typography>Dashboard</Typography>
      </RouterLink>
      {pathList.slice(0, -1).map((path) => {
        return (
          <RouterLink key={path} to={`/${path}`}>
            <Typography sx={{ textTransform: 'capitalize' }}>{path}</Typography>
          </RouterLink>
        )
      })}

      <Typography sx={{ textTransform: 'capitalize' }}>
        {pathList?.at(-1) || 'Dashboard'}
      </Typography>
    </MuiBreadcrumbs>
  )
}

export default Breadcrumbs
