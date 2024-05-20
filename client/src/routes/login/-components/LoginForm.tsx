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
      setError('username', {
        type: 'manual',
        message: 'Username or password invalide'
      })
      setError('password', {
        type: 'manual',
        message: 'Username or password invalide'
      })
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
              >
                Sign In
              </LoadingButton>
            </form>
          </FormProvider>
          {errors.username && errors.password && (
            <Typography role="alert" color="error" textAlign="center">
              {errors.username.message}
            </Typography>
          )}
        </Box>
      </Container>
    </>
  )
}

export default LoginForm
