import { Breadcrumbs as MuiBreadcrumbs, Typography } from '@mui/material'
import { Link as RouterLink, useRouter } from '@tanstack/react-router'

const Breadcrumbs = () => {
  const router = useRouter()

  const breadcrumbs =
    router.state.matches.at(-1)?.pathname.split('/').filter(Boolean) ?? []

  const title = router.state.matches.at(-1)?.context?.title

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
      {breadcrumbs?.slice(0, -1).map((path) => {
        return (
          <RouterLink key={path} to={`/${path}`}>
            <Typography sx={{ textTransform: 'capitalize' }}>{path}</Typography>
          </RouterLink>
        )
      })}

      <Typography sx={{ textTransform: 'capitalize' }}>{title}</Typography>
    </MuiBreadcrumbs>
  )
}

export default Breadcrumbs
