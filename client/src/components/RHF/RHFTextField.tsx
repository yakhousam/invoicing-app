import { Skeleton, TextField } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

interface RHFTextFieldProps extends React.ComponentProps<typeof TextField> {
  name: string
  label: string
  loading?: boolean
}

const RHFTextField = ({
  name,
  label,
  loading,
  ...delegated
}: RHFTextFieldProps) => {
  const { control } = useFormContext()
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) =>
        loading ? (
          <Skeleton variant="rectangular" width="100%" height={48} />
        ) : (
          <TextField
            {...field}
            label={label}
            error={!!error}
            helperText={error?.message}
            fullWidth
            onChange={(e) => {
              if (delegated.type === 'number' && e.target.value !== '') {
                field.onChange(parseFloat(e.target.value))
              } else {
                field.onChange(e.target.value)
              }
            }}
            {...delegated}
          />
        )
      }
    />
  )
}

export default RHFTextField
