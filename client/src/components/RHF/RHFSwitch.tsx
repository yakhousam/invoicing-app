import { FormControlLabel, Switch } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

interface RHFSwitchProps extends React.ComponentProps<typeof Switch> {
  name: string
  label: string
}

const RHFSwitch = ({ name, label, ...delegated }: RHFSwitchProps) => {
  const { control } = useFormContext()
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControlLabel
          label={label}
          control={<Switch {...field} checked={field.value} {...delegated} />}
        />
      )}
    />
  )
}

export default RHFSwitch
