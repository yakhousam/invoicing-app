import { Breadcrumbs as MuiBreadcrumbs, Typography } from '@mui/material'
import { Link as RouterLink } from '@tanstack/react-router'

const Breadcrumbs = ({
  pathList
}: {
  pathList: Array<string>
  rootName?: string
}) => {
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
