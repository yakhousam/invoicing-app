import { fetchClients } from '@/api/clients'
import { clientsOptions } from '@/queries'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef
} from 'material-react-table'
import { useMemo } from 'react'

type Columns = Awaited<ReturnType<typeof fetchClients>>[0]

const ClientsTable = () => {
  const navigate = useNavigate()
  const { data, isError, isLoading } = useSuspenseQuery(clientsOptions)
  const columns = useMemo<MRT_ColumnDef<Columns>[]>(() => {
    return [
      {
        accessorKey: 'name',
        header: 'Name'
      },
      {
        accessorKey: 'email',
        header: 'Email'
      },

      {
        accessorKey: 'address',
        header: 'Address'
      }
    ]
  }, [])

  const table = useMaterialReactTable({
    columns,
    data: data ?? [],
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
    muiTablePaperProps: {
      elevation: 0
    },
    enableFilters: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        navigate({
          to: '/clients/$id',
          params: { id: row.original._id }
        })
      },
      sx: { cursor: 'pointer' }
    })
  })

  return <MaterialReactTable table={table} />
}

export default ClientsTable
