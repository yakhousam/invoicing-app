import * as api from '@/api/user'
import { LoadingButtonSave } from '@/components/LoadingButton'
import { VisuallyHiddenInput } from '@/components/VisuallyHiddenInput'
import { baseUrl } from '@/config'
import { User } from '@/validations'
import { Button, Grid, Stack, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { useForm } from 'react-hook-form'

const Signature = ({
  user,
  onUpdateSignature
}: {
  user: User
  onUpdateSignature: (user: User) => void
}) => {
  const { enqueueSnackbar } = useSnackbar()
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { isLoading }
  } = useForm<{
    signature: FileList | undefined
  }>({
    defaultValues: {
      signature: undefined
    }
  })

  const fileList = watch('signature')
  let preview
  if (fileList && fileList.length > 0) {
    preview = URL.createObjectURL(fileList[0])
  }

  const onSubmit = ({ signature }: { signature: FileList | undefined }) => {
    if (signature) {
      mutation.mutate({ data: { signature }, userId: user._id })
    }
  }

  const mutation = useMutation({
    mutationFn: ({
      data,
      userId
    }: {
      data: { signature: FileList }
      userId: string
    }) => api.updateUserSignature(data, userId),
    onSuccess: (data) => {
      console.log('on success', data)
      enqueueSnackbar('Signature updated', { variant: 'success' })
      reset()
      onUpdateSignature(data)
    },
    onError: async () => {
      enqueueSnackbar('Error updating signature', { variant: 'error' })
    }
  })

  const userSignature = user.signatureUrl
    ? `${baseUrl}/${user.signatureUrl}`
    : 'https://via.placeholder.com/100'

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h5" fontWeight="bold">
        Signature
      </Typography>
      <Typography variant="body2" gutterBottom>
        Update your signature
      </Typography>
      <Grid container spacing={3} alignItems="center" mt={3}>
        <Grid item xs={12} md={7}>
          <img alt="signature" src={preview || userSignature} width="100%" />
        </Grid>
        <Grid item container justifyContent="flex-end" xs={12} md={5}>
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            size="small"
          >
            select your signature
            <VisuallyHiddenInput
              type="file"
              accept=".png, .jpeg, .jpg"
              {...register('signature')}
            />
          </Button>
        </Grid>
      </Grid>
      <Stack alignItems="flex-end" mt={3}>
        <LoadingButtonSave
          type="submit"
          loading={isLoading}
          disabled={fileList && fileList.length === 0}
        />
      </Stack>
    </form>
  )
}

export default Signature
