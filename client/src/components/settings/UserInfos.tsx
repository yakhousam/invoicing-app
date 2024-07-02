import * as api from '@/api/user'
import { LoadingButtonSave } from '@/components/LoadingButton'
import RHFTextField from '@/components/RHF/RHFTextField'
import { userOptions } from '@/queries/user'
import { UpdateUser, updateUserSchema } from '@/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { Stack, Typography } from '@mui/material'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { FormProvider, useForm } from 'react-hook-form'

function UserInfos() {
  const queryClient = useQueryClient()
  const { data: user } = useSuspenseQuery(userOptions)

  const { enqueueSnackbar } = useSnackbar()

  const formMethods = useForm<UpdateUser>({
    values: {
      userName: user?.userName || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || ''
    },
    resolver: zodResolver(updateUserSchema)
  })
  const {
    handleSubmit,
    formState: { isSubmitting, isDirty }
  } = formMethods

  const mutation = useMutation({
    mutationFn: api.updateMyProfile,
    onSuccess: (data) => {
      enqueueSnackbar('Profile updated', { variant: 'success' })
      queryClient.setQueryData(userOptions.queryKey, data)
    },
    onError: async (error: Error | Response) => {
      console.log('on error ', error)
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
        enqueueSnackbar('Error updating profile', { variant: 'error' })
      }
    }
  })
  const onSubmit = (data: UpdateUser) => {
    mutation.mutate(data)
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
              label="Username"
              name="userName"
              autoFocus
            />
            <RHFTextField
              variant="standard"
              margin="normal"
              fullWidth
              label="First Name"
              name="firstName"
            />
            <RHFTextField
              variant="standard"
              margin="normal"
              fullWidth
              label="Last Name"
              name="lastName"
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
