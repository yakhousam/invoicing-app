import * as api from '@/api/clients'
import { LoadingButtonSave } from '@/components/LoadingButton'
import RHFTextField from '@/components/RHF/RHFTextField'
import { clientByIdOptions } from '@/queries'
import { UpdateClient, updateClientSchema } from '@/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { Stack } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { useSnackbar } from 'notistack'
import { FormProvider, useForm } from 'react-hook-form'

const ClientEdit = () => {
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()
  const { id } = useParams({ from: '/_auth/_layout/clients/$id' })

  const { data, isLoading } = useQuery(clientByIdOptions(id))

  const parsedClient = updateClientSchema.safeParse(data)

  const formMethods = useForm<UpdateClient>({
    values: {
      name: parsedClient.data?.name || '',
      email: parsedClient.data?.email || '',
      address: parsedClient.data?.address || ''
    },
    resolver: zodResolver(updateClientSchema)
  })

  const {
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting, isDirty }
  } = formMethods

  const mutation = useMutation({
    mutationFn: (data: UpdateClient) => api.updateClient(id, data),
    onSuccess: (data) => {
      enqueueSnackbar('Client updated', { variant: 'success' })
      queryClient.setQueryData(clientByIdOptions(id).queryKey, data)
      reset(data)
    },
    onError: async (error: Error | Response) => {
      if (error instanceof Response && error.status === 409) {
        const data = (await error.json()) as {
          error: 'DuplicateKeyError'
          message: string
          field: keyof UpdateClient
          value: string
        }
        setError(data.field, {
          message: `a client with the same ${data.field} already exists: ${data.value}`
        })
      } else {
        enqueueSnackbar('Error updating client', { variant: 'error' })
      }
    }
  })

  const onSubmit = (data: UpdateClient) => {
    mutation.mutate(data)
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={6} mt={3}>
          <RHFTextField
            variant="standard"
            margin="normal"
            fullWidth
            label="Name"
            name="name"
            loading={isLoading}
            autoFocus
          />
          <RHFTextField
            variant="standard"
            margin="normal"
            fullWidth
            label="Email"
            name="email"
            loading={isLoading}
          />
          <RHFTextField
            variant="standard"
            margin="normal"
            fullWidth
            label="Address"
            name="address"
            loading={isLoading}
          />
          <LoadingButtonSave
            type="submit"
            loading={isSubmitting}
            disabled={!isDirty}
            sx={{ alignSelf: 'flex-end' }}
          />
        </Stack>
      </form>
    </FormProvider>
  )
}

export default ClientEdit
