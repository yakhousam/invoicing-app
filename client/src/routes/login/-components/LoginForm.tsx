import LoadingButton from '@/components/LoadingButton'
import RHFTextField from '@/components/RHF/RHFTextField'
import { Box, Container, CssBaseline, Typography } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'

type LoginFormProps = {
  submitError?: string | null
  handleSubmit: ({
    username,
    password
  }: {
    username: string
    password: string
  }) => Promise<void>
}

const LoginForm = ({ handleSubmit: onSubmit, submitError }: LoginFormProps) => {
  const formMethods = useForm({
    defaultValues: {
      username: '',
      password: ''
    }
  })

  const {
    handleSubmit,

    formState: { isSubmitting }
  } = formMethods

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
          {submitError && <Typography color="error">{submitError}</Typography>}
        </Box>
      </Container>
    </>
  )
}

export default LoginForm
