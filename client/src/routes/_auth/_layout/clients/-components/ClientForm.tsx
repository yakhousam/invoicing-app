import * as api from '@/api/clients'
import LoadingButton from '@/components/LoadingButton'
import RHFTextField from '@/components/RHF/RHFTextField'
import { CreateClient, createClientSchema } from '@/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { FormProvider, useForm } from 'react-hook-form'

function ClientForm() {
  const { enqueueSnackbar } = useSnackbar()
  const formMethods = useForm<CreateClient>({
    defaultValues: {
      name: '',
      email: '',
      address: ''
    },
    resolver: zodResolver(createClientSchema)
  })
  const {
    handleSubmit,
    setError,
    formState: { isSubmitting }
  } = formMethods

  const mutation = useMutation({
    mutationFn: (data: CreateClient) => api.createClient(data),
    onSuccess: () => {
      formMethods.reset()
      enqueueSnackbar('Client created', { variant: 'success' })
      console.log('Client created', enqueueSnackbar.toString())
    },
    onError: async (error: Error | Response) => {
      if (error instanceof Response && error.status === 409) {
        const data = (await error.json()) as {
          error: 'DuplicateKeyError'
          message: string
          field: keyof CreateClient
          value: string
        }
        setError(data.field, {
          message: `a client with the same ${data.field} already exists: ${data.value}`
        })
      } else {
        enqueueSnackbar('Error creating client', { variant: 'error' })
      }
    }
  })
  const onSubmit = (data: CreateClient) => {
    mutation.mutate(data)
  }
  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <RHFTextField
          variant="outlined"
          margin="normal"
          fullWidth
          label="Name"
          name="name"
          autoFocus
        />
        <RHFTextField
          variant="outlined"
          margin="normal"
          fullWidth
          label="Email"
          name="email"
        />
        <RHFTextField
          variant="outlined"
          margin="normal"
          fullWidth
          label="Address"
          name="address"
        />
        <LoadingButton
          type="submit"
          loading={isSubmitting}
          fullWidth
          variant="contained"
          color="primary"
        >
          Create
        </LoadingButton>
      </form>
    </FormProvider>
  )
}

export default ClientForm
