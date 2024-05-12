import { fetchInvoices } from '@/api/invoice'
import { invoicesQueryOptions } from '@/invoicesQueryOptions'
import { useSuspenseQuery } from '@tanstack/react-query'
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef
} from 'material-react-table'
import { useMemo } from 'react'

type Columns = Awaited<ReturnType<typeof fetchInvoices>>[0]

const DashboardTable = () => {
  const { data, isError, isLoading } = useSuspenseQuery(invoicesQueryOptions)
  const columns = useMemo<MRT_ColumnDef<Columns>[]>(() => {
    return [
      {
        accessorKey: 'invoiceNo',
        header: 'N°'
      },
      {
        accessorKey: 'client.name',
        header: 'Client'
      },
      {
        accessorKey: 'invoiceDate',
        header: 'Date'
      },
      {
        accessorKey: 'status',
        header: 'Status'
      },
      {
        accessorKey: 'totalAmount',
        header: 'Price'
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
    enablePagination: false,
    enableFilters: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableHiding: false
  })

  return <MaterialReactTable table={table} />
}

export default DashboardTable
