import { formatCurrency } from '@/helpers'
import { summaryOptions } from '@/queries'
import { Divider, Stack, Typography } from '@mui/material'
import { useSuspenseQuery } from '@tanstack/react-query'

export const Summary = () => {
  const { data = [] } = useSuspenseQuery(summaryOptions)

  return (
    <Stack spacing={2}>
      <Typography variant="h5" textAlign="center" fontWeight="bold">
        Financial Overview
      </Typography>
      {data.map(({ currency, total, paid, unpaid }, index) => {
        const numberToCurrency = formatCurrency(currency)
        return (
          <Stack key={currency} spacing={1}>
            <Stack direction="row" spacing={1} justifyContent="space-between">
              <Typography variant="h6" fontWeight="bold">
                {currency}
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {numberToCurrency(total)}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Typography variant="body1">Paid</Typography>
              <Typography variant="body1">{numberToCurrency(paid)}</Typography>
            </Stack>
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Typography variant="body1">Unpaid</Typography>
              <Typography variant="body1">
                {numberToCurrency(unpaid)}
              </Typography>
            </Stack>
            {index !== 2 && <Divider />}
          </Stack>
        )
      })}
    </Stack>
  )
}
