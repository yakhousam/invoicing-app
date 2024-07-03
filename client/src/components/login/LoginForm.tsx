import LoadingButton from '@/components/LoadingButton'
import RHFTextField from '@/components/RHF/RHFTextField'
import { Box, Container, CssBaseline, Typography } from '@mui/material'
import { Link as RouterLink, useRouteContext } from '@tanstack/react-router'
import { FormProvider, useForm } from 'react-hook-form'

const LoginForm = ({ onLogin }: { onLogin: () => Promise<void> }) => {
  const { auth } = useRouteContext({ from: '/login' })
  const formMethods = useForm({
    defaultValues: {
      username: '',
      password: ''
    }
  })
  const {
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting }
  } = formMethods

  const onSubmit = async ({
    username,
    password
  }: {
    username: string
    password: string
  }) => {
    try {
      await auth.login(username, password)
      await onLogin()
    } catch (error) {
      if (error instanceof Response && error.status === 401) {
        setError('root.error', {
          message: 'Username or password invalid'
        })
      } else {
        setError('root.error', {
          message: 'Something went wrong'
        })
      }
    }
  }

  return (
    <>
      <CssBaseline />
      <Container component="main" maxWidth="xs">
        <Box mt={12}>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <FormProvider {...formMethods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <RHFTextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Username"
                name="username"
                autoFocus
                autoComplete="username"
              />
              <RHFTextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                autoComplete="current-password"
              />
              <Box mt={2} />
              <LoadingButton
                type="submit"
                loading={isSubmitting}
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => clearErrors()}
              >
                Sign In
              </LoadingButton>
            </form>
          </FormProvider>
          {errors.root?.error && (
            <Box mt={2}>
              <Typography role="alert" color="error" textAlign="center">
                {errors.root.error.message}
              </Typography>
            </Box>
          )}
          <Box mt={2} />
          <RouterLink to="/register">
            <Typography variant="body2" color="primary">
              {"Don't have an account? Sign Up"}
            </Typography>
          </RouterLink>
        </Box>
      </Container>
    </>
  )
}

export default LoginForm
