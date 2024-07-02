import * as api from '@/api/user'
import { LoadingButtonSave } from '@/components/LoadingButton'
import RHFTextField from '@/components/RHF/RHFTextField'
import useLogout from '@/hooks/useLogout'
import { UpdateUserPassword, updateUserPasswordSchema } from '@/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { Stack, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { FormProvider, useForm } from 'react-hook-form'

const PasswordUpdate = () => {
  const { handleLogout } = useLogout()
  const { enqueueSnackbar } = useSnackbar()

  const formMethods = useForm<UpdateUserPassword>({
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    },
    resolver: zodResolver(updateUserPasswordSchema)
  })
  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, isDirty }
  } = formMethods

  const { mutate: updateUserPassword } = useMutation({
    mutationKey: ['updateUserPassword'],
    mutationFn: api.updateMyPassword,
    onSuccess: () => {
      enqueueSnackbar('Password updated successfully', { variant: 'success' })
      handleLogout()
    },
    onError: (error: Error | Response) => {
      if (error instanceof Response && error.status) {
        setError('oldPassword', {
          message: 'wrong password'
        })
      } else {
        console.error(error)
        enqueueSnackbar('Error updating password', { variant: 'error' })
      }
    }
  })

  const onSubmit = (data: UpdateUserPassword) => {
    updateUserPassword(data)
  }

  return (
    <>
      <Typography variant="h5" fontWeight="bold">
        Password
      </Typography>
      <Typography variant="body2" gutterBottom>
        Update your password
      </Typography>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={6} mt={3}>
            <RHFTextField
              variant="standard"
              label="Old password"
              name="oldPassword"
              type="password"
            />
            <RHFTextField
              variant="standard"
              label="New password"
              name="newPassword"
              type="password"
            />
            <RHFTextField
              variant="standard"
              label="Confirm new password"
              name="confirmNewPassword"
              type="password"
            />
            <LoadingButtonSave
              loading={isSubmitting}
              type="submit"
              disabled={!isDirty}
              sx={{ alignSelf: 'flex-end' }}
            />
          </Stack>
        </form>
      </FormProvider>
    </>
  )
}

export default PasswordUpdate
