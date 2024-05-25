import { TextField } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

interface RHFTextFieldProps extends React.ComponentProps<typeof TextField> {
  name: string
  label: string
}

const RHFTextField = ({ name, label, ...delegated }: RHFTextFieldProps) => {
  const { control } = useFormContext()
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
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
      )}
    />
  )
}

export default RHFTextField
