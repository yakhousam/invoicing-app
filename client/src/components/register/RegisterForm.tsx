import * as authApi from '@/api/auth'
import LoadingButton from '@/components/LoadingButton'
import RHFTextField from '@/components/RHF/RHFTextField'
import { User } from '@/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Container, CssBaseline, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from '@tanstack/react-router'
import { useSnackbar } from 'notistack'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

const registerFormSchema = z
  .object({
    username: z
      .string()
      .min(2, 'Username must be at least 2 characters')
      .max(20, 'Username must be at most 20 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  })

const RegisterForm = ({
  onRegister
}: {
  onRegister: (user: User) => Promise<void>
}) => {
  const { enqueueSnackbar } = useSnackbar()
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
    setError,
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
      const user = await authApi.register(username, password)
      await onRegister(user)
    } catch (error) {
      if (error instanceof Response && error.status === 400) {
        setError('username', {
          message: 'Username already exists'
        })
      } else {
        enqueueSnackbar('Error creating user', { variant: 'error' })
      }
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
                  autoComplete="new-password"
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
          <Box mt={2} />
          <RouterLink to="/login">
            <Typography variant="body2" color="primary">
              {'Already have an account? Sign in'}
            </Typography>
          </RouterLink>
        </Box>
      </Container>
    </>
  )
}

export default RegisterForm
