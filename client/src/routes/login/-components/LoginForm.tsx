import LoadingButton from '@/components/LoadingButton'
import RHFTextField from '@/components/RHF/RHFTextField'
import { Box, Container, CssBaseline, Typography } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'

type LoginFormProps = {
  onSubmit: ({
    username,
    password
  }: {
    username: string
    password: string
  }) => Promise<void>
}

const LoginForm = ({ onSubmit }: LoginFormProps) => {
  const formMethods = useForm({
    defaultValues: {
      username: '',
      password: ''
    }
  })

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, errors }
  } = formMethods

  const formSubmit = async (data: Parameters<typeof onSubmit>[0]) => {
    try {
      await onSubmit(data)
    } catch (error) {
      setError('username', {
        type: 'manual',
        message: 'username or password invalide'
      })
      setError('password', {
        type: 'manual',
        message: 'username or password invalide'
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
            <form onSubmit={handleSubmit(formSubmit)}>
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
              <LoadingButton
                type="submit"
                loading={isSubmitting}
                fullWidth
                variant="contained"
                color="primary"
              >
                Sign In
              </LoadingButton>
            </form>
          </FormProvider>
          {errors.username && errors.password && (
            <Typography color="error">{errors.username.message}</Typography>
          )}
        </Box>
      </Container>
    </>
  )
}

export default LoginForm
