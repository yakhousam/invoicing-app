import * as api from '@/api/user'
import { LoadingButtonSave } from '@/components/LoadingButton'
import RHFTextField from '@/components/RHF/RHFTextField'
import { UpdateUser, User, updateUserSchema } from '@/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { Stack, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { FormProvider, useForm } from 'react-hook-form'

function UserInfos({
  user,
  onUpdateUser
}: {
  user: User
  onUpdateUser: (user: User) => void
}) {
  const { enqueueSnackbar } = useSnackbar()
  const formMethods = useForm<UpdateUser>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || ''
    },
    resolver: zodResolver(updateUserSchema)
  })
  const {
    handleSubmit,
    formState: { isSubmitting, isDirty }
  } = formMethods

  const mutation = useMutation({
    mutationFn: ({ data, userId }: { data: UpdateUser; userId: string }) =>
      api.updateUser(data, userId),
    onSuccess: (data) => {
      enqueueSnackbar('User updated', { variant: 'success' })
      onUpdateUser(data)
    },
    onError: async (error: Error | Response) => {
      if (error instanceof Response && error.status === 409) {
        // const data = (await error.json()) as {
        //   error: 'DuplicateKeyError'
        //   message: string
        //   field: keyof CreateClient
        //   value: string
        // }
        // setError(data.field, {
        //   message: `a client with the same ${data.field} already exists: ${data.value}`
        // })
      } else {
        enqueueSnackbar('Error creating client', { variant: 'error' })
      }
    }
  })
  const onSubmit = (data: UpdateUser) => {
    mutation.mutate({ data, userId: user._id })
  }
  return (
    <>
      <Typography variant="h5" fontWeight="bold">
        User Information
      </Typography>
      <Typography variant="body2" gutterBottom>
        Update your personal information
      </Typography>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={6} mt={3}>
            <RHFTextField
              variant="standard"
              margin="normal"
              fullWidth
              label="Name"
              name="name"
              autoFocus
            />

            <RHFTextField
              variant="standard"
              margin="normal"
              fullWidth
              label="Email"
              name="email"
            />
            <LoadingButtonSave
              type="submit"
              loading={isSubmitting}
              disabled={!isDirty}
              sx={{ alignSelf: 'flex-end' }}
            >
              Save
            </LoadingButtonSave>
          </Stack>
        </form>
      </FormProvider>
    </>
  )
}

export default UserInfos
