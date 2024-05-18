import { Box, Button, CircularProgress } from '@mui/material'

interface LoadingButtonProps extends React.ComponentProps<typeof Button> {
  loading: boolean
  children: React.ReactNode
}

const LoadingButton = ({
  loading,
  children,
  ...delegated
}: LoadingButtonProps) => {
  return (
    <Box sx={{ position: 'relative' }}>
      <Button variant="contained" disabled={loading} {...delegated}>
        {children}
      </Button>
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
    </Box>
  )
}

export default LoadingButton
