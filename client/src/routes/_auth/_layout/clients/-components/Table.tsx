import { fetchClients } from '@/api/clients'
import { useSuspenseQuery } from '@tanstack/react-query'
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef
} from 'material-react-table'
import { useMemo } from 'react'
import { clientQueryOptions } from '../-query-options/clientQueryOption'

type Columns = Awaited<ReturnType<typeof fetchClients>>[0]

const ClientsTable = () => {
  //   const navigate = useNavigate()
  const { data, isError, isLoading } = useSuspenseQuery(clientQueryOptions)
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
    enableFullScreenToggle: false
    // muiTableBodyRowProps: ({ row }) => ({
    //   onClick: () => {
    //     navigate({
    //       to: '/invoices/$id',
    //       params: { id: row.original._id }
    //     })
    //   },
    //   sx: { cursor: 'pointer' }
    // })
  })

  return <MaterialReactTable table={table} />
}

export default ClientsTable
