import { LoadingButtonSave } from '@/components/LoadingButton'
import RHFTextField from '@/components/RHF/RHFTextField'
import { zodResolver } from '@hookform/resolvers/zod'
import { Stack, Typography } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import z from 'zod'

const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(6),
    confirmNewPassword: z.string().min(6)
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ['confirmNewPassword']
  })

type UpdatePassword = z.infer<typeof updatePasswordSchema>

const PasswordUpdate = () => {
  const formMethods = useForm<UpdatePassword>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    },
    resolver: zodResolver(updatePasswordSchema)
  })
  const {
    handleSubmit,
    formState: { isSubmitting, isDirty }
  } = formMethods

  const onSubmit = (data: UpdatePassword) => {
    console.log(data)
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
              label="Current password"
              name="currentPassword"
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
