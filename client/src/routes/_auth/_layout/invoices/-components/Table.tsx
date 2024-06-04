import { fetchInvoices } from '@/api/invoice'
import { formatCurrency } from '@/helpers'
import { invoicesOptions } from '@/queries'
import { Chip, Typography } from '@mui/material'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import dayjs from 'dayjs'
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef
} from 'material-react-table'
import { useMemo } from 'react'

type Columns = Awaited<ReturnType<typeof fetchInvoices>>[0]

const InvoicesTable = () => {
  const navigate = useNavigate()
  const { data, isError, isLoading } = useSuspenseQuery(invoicesOptions)
  const columns = useMemo<MRT_ColumnDef<Columns>[]>(() => {
    return [
      {
        accessorKey: 'invoiceNoString',
        header: 'N°'
      },
      {
        accessorKey: 'client.name',
        header: 'Client'
      },
      {
        accessorKey: 'invoiceDate',
        header: 'Date',
        accessorFn(originalRow) {
          return dayjs(originalRow.invoiceDate).format('DD/MM/YYYY')
        }
      },
      {
        accessorKey: 'status',
        header: 'Status',
        Cell: ({ cell }) => {
          const status = cell.getValue<Columns['status']>()
          return (
            <Chip
              label={
                <Typography variant="inherit" textTransform="capitalize">
                  {status}
                </Typography>
              }
              color={
                status === 'paid'
                  ? 'success'
                  : status === 'sent'
                    ? 'info'
                    : 'secondary'
              }
            />
          )
        }
      },
      {
        accessorKey: 'totalAmount',
        header: 'Price',
        accessorFn(originalRow) {
          return formatCurrency(originalRow.currency)(originalRow.totalAmount)
        }
      }
    ]
  }, [])

  const table = useMaterialReactTable({
    columns,
    data,
    state: {
      isLoading,
      showAlertBanner: isError
    },
    muiToolbarAlertBannerProps: isError
      ? {
          color: 'error',
          children: 'Error loading data'
        }
      : undefined,
    enableFilters: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        navigate({
          to: '/invoices/$id',
          params: { id: row.original._id }
        })
      },
      sx: { cursor: 'pointer' }
    }),
    muiTablePaperProps: {
      elevation: 0
    }
  })

  return <MaterialReactTable table={table} />
}

export default InvoicesTable
