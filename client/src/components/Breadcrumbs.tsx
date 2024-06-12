import { Breadcrumbs as MuiBreadcrumbs, Typography } from '@mui/material'
import { Link as RouterLink } from '@tanstack/react-router'

const Breadcrumbs = ({
  pathList,
  rootName = 'Dashboard'
}: {
  pathList: Array<string>
  rootName?: string
}) => {
  if (pathList.length < 1) {
    return (
      <MuiBreadcrumbs>
        <Typography sx={{ textTransform: 'capitalize' }}>{rootName}</Typography>
      </MuiBreadcrumbs>
    )
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
        <Typography sx={{ textTransform: 'capitalize' }}>{rootName}</Typography>
      </RouterLink>

      {pathList.slice(0, -1).map((path) => {
        return (
          <RouterLink key={path} to={`/${path}`}>
            <Typography sx={{ textTransform: 'capitalize' }}>{path}</Typography>
          </RouterLink>
        )
      })}

      <Typography sx={{ textTransform: 'capitalize' }}>
        {pathList?.at(-1)}
      </Typography>
    </MuiBreadcrumbs>
  )
}

export default Breadcrumbs
