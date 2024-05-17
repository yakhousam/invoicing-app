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
      render={({ field }) => (
        <TextField {...field} label={label} fullWidth {...delegated} />
      )}
    />
  )
}

export default RHFTextField
