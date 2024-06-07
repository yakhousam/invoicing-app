import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import { Button, CircularProgress } from '@mui/material'

interface LoadingButtonProps extends React.ComponentProps<typeof Button> {
  loading: boolean
  children?: React.ReactNode
}

export const LoadingButton = ({
  loading,
  children,
  ...delegated
}: LoadingButtonProps) => {
  return (
    <Button
      variant="contained"
      disabled={loading}
      {...delegated}
      sx={{ position: 'relative', ...(delegated.sx || {}) }}
    >
      {children}
      {loading && (
        <CircularProgress
          size={24}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: '-12px',
            marginLeft: '-12px'
          }}
        />
      )}
    </Button>
  )
}

export const LoadingButtonDelete = ({
  loading,
  children,
  ...delegated
}: LoadingButtonProps) => {
  return (
    <LoadingButton
      loading={loading}
      color="error"
      variant="contained"
      sx={{ color: 'white' }}
      startIcon={<DeleteIcon />}
      {...delegated}
    >
      {children || 'Delete'}
    </LoadingButton>
  )
}

export const LoadingButtonSave = ({
  loading,
  children,
  ...delegated
}: LoadingButtonProps) => {
  return (
    <LoadingButton
      loading={loading}
      color="primary"
      variant="contained"
      sx={{ color: 'white' }}
      startIcon={<SaveIcon />}
      {...delegated}
    >
      {children || 'Save'}
    </LoadingButton>
  )
}

export default LoadingButton
