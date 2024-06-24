import { TextField } from '@mui/material'
import dayjs from 'dayjs'

import { Controller, useFormContext } from 'react-hook-form'

interface RHFDatePickerProps extends React.ComponentProps<typeof TextField> {
  name: string
  label: string
}

const RHFDatePicker = ({ name, label, ...delegated }: RHFDatePickerProps) => {
  const { control } = useFormContext()
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          label={label}
          type="date"
          error={!!error}
          helperText={error?.message}
          fullWidth
          value={dayjs(field.value).format('YYYY-MM-DD')}
          onChange={(e) => {
            field.onChange(dayjs(e.target.value).toISOString())
          }}
          {...delegated}
        />
      )}
    />
  )
}

export default RHFDatePicker
