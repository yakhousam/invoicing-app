import { MenuItem, TextField } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

interface RHFSelectProps extends React.ComponentProps<typeof TextField> {
  name: string
  label: string
  options?: { value: string; label: string }[]
}

const RHFSelect = ({ name, label, options, ...delegated }: RHFSelectProps) => {
  const { control } = useFormContext()
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          select
          label={label}
          error={!!error}
          helperText={error?.message}
          fullWidth
          {...delegated}
        >
          {options?.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  )
}

export default RHFSelect
