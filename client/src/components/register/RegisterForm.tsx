import * as authApi from '@/api/auth'
import LoadingButton from '@/components/LoadingButton'
import RHFTextField from '@/components/RHF/RHFTextField'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Container, CssBaseline, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from '@tanstack/react-router'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

const registerFormSchema = z
  .object({
    username: z.string().min(2).max(20),
    password: z.string().min(6),
    confirmPassword: z.string().min(6)
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  })

const RegisterForm = ({ onRegister }: { onRegister: () => Promise<void> }) => {
  const formMethods = useForm({
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: ''
    },
    resolver: zodResolver(registerFormSchema)
  })

  const {
    handleSubmit,
    clearErrors,
    formState: { errors, isSubmitting }
  } = formMethods
  console.log('errors', errors)

  const onSubmit = async ({
    username,
    password
  }: {
    username: string
    password: string
  }) => {
    try {
      await authApi.register(username, password)
      await onRegister()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <CssBaseline />
      <Container component="main" maxWidth="xs">
        <Box mt={12}>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <FormProvider {...formMethods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={3} mt={3}>
                <RHFTextField
                  variant="outlined"
                  fullWidth
                  label="Username"
                  name="username"
                  autoFocus
                />
                <RHFTextField
                  variant="outlined"
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  autoComplete="new-password"
                />
                <RHFTextField
                  variant="outlined"
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                />
                <LoadingButton
                  type="submit"
                  loading={isSubmitting}
                  fullWidth
                  onClick={() => clearErrors()}
                >
                  Register
                </LoadingButton>
              </Stack>
            </form>
          </FormProvider>
          {errors.root?.error && (
            <Box mt={2}>
              <Typography role="alert" color="error" textAlign="center">
                {errors.root.error.message}
              </Typography>
            </Box>
          )}
          <RouterLink to="/login">
            {'Already have an account? Sign in'}
          </RouterLink>
        </Box>
      </Container>
    </>
  )
}

export default RegisterForm
