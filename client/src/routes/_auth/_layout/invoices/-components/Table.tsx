import { fetchInvoices } from '@/api/invoice'
import { formatCurrency } from '@/helpers'
import { invoicesOptions } from '@/queries'
import { invoicesSearchSchema } from '@/validations'
import { Chip, Typography } from '@mui/material'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useNavigate, useSearch } from '@tanstack/react-router'
import dayjs from 'dayjs'
import {
  MRT_ColumnFiltersState,
  MRT_Updater,
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef
} from 'material-react-table'
import { useMemo, useState } from 'react'

type Columns = Awaited<ReturnType<typeof fetchInvoices>>[0]

type TableProps = Parameters<typeof useMaterialReactTable>['0']
type Props = Pick<
  TableProps,
  'enablePagination' | 'enableSorting' | 'enableFilters'
>

const InvoicesTable = ({ ...props }: Props) => {
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([])
  const navigate = useNavigate()
  const looseSearch = useSearch({ strict: false })
  const searchParams =
    'redirect' in looseSearch ? {} : invoicesSearchSchema.parse(looseSearch)

  const queryOptions = invoicesOptions(searchParams)
  const { data, isError, isLoading } = useSuspenseQuery(queryOptions)

  function handleFilterChange(
    newColumnFilters: MRT_Updater<MRT_ColumnFiltersState>
  ) {
    const filters =
      typeof newColumnFilters === 'function'
        ? newColumnFilters(columnFilters)
        : newColumnFilters
    console.log('handle change columnFilters', filters)
    setColumnFilters(filters)
    const search = filters.reduce((acc, filter) => {
      const { id, value } = filter
      return { ...acc, [id]: value }
    }, {})
    navigate({
      search: invoicesSearchSchema.parse(search)
    })
  }

  const columns = useMemo<MRT_ColumnDef<Columns>[]>(() => {
    return [
      {
        accessorKey: 'invoiceNoString',
        header: 'N°',
        enableColumnFilter: false
      },
      {
        accessorKey: 'clientName',
        header: 'Client',
        accessorFn(originalRow) {
          return originalRow.client.name
        },
        filterFn: 'customFilterFn'
      },
      {
        accessorKey: 'invoiceDate',
        header: 'Date',
        accessorFn(originalRow) {
          return dayjs(originalRow.invoiceDate).format('DD/MM/YYYY')
        },
        enableColumnFilter: false
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 50,
        enableColumnFilter: true,
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
        enableColumnFilter: false,
        accessorFn(originalRow) {
          return formatCurrency(originalRow.currency)(originalRow.totalAmount)
        },
        muiTableHeadCellProps: {
          align: 'right'
        },
        muiTableBodyCellProps: {
          align: 'right'
        }
      }
    ]
  }, [])

  const table = useMaterialReactTable({
    columns,
    data,
    state: {
      isLoading,
      showAlertBanner: isError,
      columnFilters
    },
    muiToolbarAlertBannerProps: isError
      ? {
          color: 'error',
          children: 'Error loading data'
        }
      : undefined,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableGlobalFilter: false,
    enableRowSelection: false,
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    onColumnFiltersChange: handleFilterChange,
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
    },
    ...props
  })

  return <MaterialReactTable table={table} />
}

export default InvoicesTable
