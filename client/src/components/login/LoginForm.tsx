import * as api from '@/api/auth'
import LoadingButton from '@/components/LoadingButton'
import RHFTextField from '@/components/RHF/RHFTextField'
import { User } from '@/validations'
import { Box, Container, CssBaseline, Typography } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'

const LoginForm = ({ onLogin }: { onLogin: (user: User) => void }) => {
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
    formState: { isSubmitting, errors, isSubmitSuccessful }
  } = formMethods

  const onSubmit = async ({
    username,
    password
  }: {
    username: string
    password: string
  }) => {
    try {
      const user = await api.login(username, password)
      onLogin(user)
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
              <Box mt={2} />
              <LoadingButton
                type="submit"
                loading={isSubmitting || isSubmitSuccessful}
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
        </Box>
      </Container>
    </>
  )
}

export default LoginForm
