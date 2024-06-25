import { totalsByMonthOptions } from '@/queries'
import { BarChart } from '@mui/x-charts/BarChart'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'

export const Chart = () => {
  const { data } = useQuery(totalsByMonthOptions)
  const dataset = data?.map((item) => ({
    ...item,
    date: dayjs()
      .month(item.date.month - 1)
      .format('MMMM')
  }))
  return (
    <BarChart
      dataset={dataset ?? []}
      xAxis={[{ scaleType: 'band', dataKey: 'date' }]}
      series={[
        { dataKey: 'total', label: 'Total' },
        // { dataKey: 'paid', label: 'Paid' },
        { dataKey: 'unpaid', label: 'unpaid' }
      ]}
    />
  )
}
