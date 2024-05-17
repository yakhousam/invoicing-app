import RHFTextField from '@/components/RHF/RHFTextField'
import { Box, Button, Container, CssBaseline, Typography } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'

type LoginFormProps = {
  handleSubmit: ({
    username,
    password
  }: {
    username: string
    password: string
  }) => Promise<void>
}

const LoginForm = ({ handleSubmit: onSubmit }: LoginFormProps) => {
  const formMethods = useForm({
    defaultValues: {
      username: '',
      password: ''
    }
  })

  return (
    <>
      <CssBaseline />
      <Container component="main" maxWidth="xs">
        <Box mt={12}>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <FormProvider {...formMethods}>
            <form onSubmit={formMethods.handleSubmit(onSubmit)}>
              <RHFTextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Username"
                name="username"
                autoFocus
              />
              <RHFTextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                Sign In
              </Button>
            </form>
          </FormProvider>
        </Box>
      </Container>
    </>
  )
}

export default LoginForm
