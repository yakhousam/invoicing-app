import { fetchInvoices } from '@/api/invoice'
import { formatCurrency } from '@/helpers'
import { invoicesOptions } from '@/queries'
import { invoicesSearchSchema } from '@/validations'
import { Chip, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useSearch } from '@tanstack/react-router'
import dayjs from 'dayjs'
import {
  MRT_ColumnFiltersState,
  MRT_PaginationState,
  MRT_SortingState,
  MRT_Updater,
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef
} from 'material-react-table'
import { useMemo } from 'react'

type Columns = Awaited<ReturnType<typeof fetchInvoices>>['invoices'][0]

const InvoicesTable = () => {
  const navigate = useNavigate()
  const looseSearch = useSearch({ strict: false })
  const searchParams = invoicesSearchSchema.parse(looseSearch)

  const queryOptions = invoicesOptions(searchParams)

  const { data, isError, isLoading } = useQuery(queryOptions)

  const columnFilters = (
    ['clientName', 'status'] as const
  ).reduce<MRT_ColumnFiltersState>((acc, id) => {
    const value = searchParams[id]
    return value ? [...acc, { id, value }] : acc
  }, [])

  function handleFilterChange(
    newColumnFilters: MRT_Updater<MRT_ColumnFiltersState>
  ) {
    const filters =
      typeof newColumnFilters === 'function'
        ? newColumnFilters(columnFilters)
        : newColumnFilters

    const search = filters.reduce((acc, filter) => {
      const { id, value } = filter
      return { ...acc, [id]: value }
    }, {})

    navigate({
      search: invoicesSearchSchema.parse(search)
    })
  }

  function handlePaginationChange(
    changePage: MRT_Updater<MRT_PaginationState>
  ) {
    const pagination =
      typeof changePage === 'function'
        ? changePage({
            pageIndex: searchParams.page,
            pageSize: searchParams.limit
          })
        : changePage
    navigate({
      search: (prev) => ({
        ...prev,
        page: pagination.pageIndex,
        limit: pagination.pageSize
      })
    })
  }

  function handleSortingChange(changeSorting: MRT_Updater<MRT_SortingState>) {
    const sorting =
      typeof changeSorting === 'function' ? changeSorting([]) : changeSorting
    navigate({
      search: (prev) => ({
        ...prev,
        sortBy: sorting[0]?.id,
        orderDirection: sorting[0]?.desc ? 'desc' : 'asc'
      })
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
        filterFn: 'customFilterFn',
        enableSorting: false
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
        filterVariant: 'select',
        filterSelectOptions: ['sent', 'paid', 'overdue'],
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
    data: data?.invoices ?? [],
    initialState: {
      showColumnFilters:
        [searchParams.clientName, searchParams.status].filter(Boolean).length >
        0
    },
    state: {
      showSkeletons: isLoading,
      showAlertBanner: isError,
      columnFilters,
      pagination: {
        pageIndex: searchParams.page,
        pageSize: searchParams.limit
      },
      sorting: [
        {
          id: searchParams.sortBy,
          desc: searchParams.orderDirection === 'desc'
        }
      ]
    },
    rowCount: data?.totalInvoices ?? 0,
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
    onPaginationChange: handlePaginationChange,
    onSortingChange: handleSortingChange,
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
    muiPaginationProps: {
      rowsPerPageOptions: [2, 10, 25, 50]
    }
  })

  return <MaterialReactTable table={table} />
}

export default InvoicesTable
