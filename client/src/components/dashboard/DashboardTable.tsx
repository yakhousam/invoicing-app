import { formatCurrency } from '@/helpers'
import { invoicesOptions } from '@/queries'
import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import dayjs from 'dayjs'

const DashboardTable = () => {
  const queryOptions = invoicesOptions({
    page: 0,
    limit: 5,
    sortBy: 'invoiceDate',
    orderDirection: 'desc'
  })
  const { data } = useQuery(queryOptions)
  const navigate = useNavigate()
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell variant="head">N°</TableCell>
            <TableCell>Client</TableCell>
            <TableCell>Date</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="right">Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.invoices?.map((invoice) => (
            <TableRow
              key={invoice._id}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  cursor: 'pointer'
                }
              }}
              onClick={() => {
                navigate({
                  to: '/invoices/$id',
                  params: { id: invoice._id }
                })
              }}
            >
              <TableCell>{invoice.invoiceNoString}</TableCell>
              <TableCell>{invoice.client.name}</TableCell>
              <TableCell>
                {dayjs(invoice.invoiceDate).format('DD/MM/YYYY')}
              </TableCell>
              <TableCell align="center">
                <Chip
                  label={
                    <Typography variant="inherit" textTransform="capitalize">
                      {invoice.status}
                    </Typography>
                  }
                  color={
                    invoice.status === 'paid'
                      ? 'success'
                      : invoice.status === 'sent'
                        ? 'info'
                        : 'secondary'
                  }
                />
              </TableCell>
              <TableCell align="right">
                {formatCurrency(invoice.currency)(invoice.totalAmount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default DashboardTable
