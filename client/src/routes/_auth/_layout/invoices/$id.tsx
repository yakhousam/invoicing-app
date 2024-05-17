import { fetchInvoiceById } from '@/api/invoice'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

const invoiceQuery = (id: string) =>
  queryOptions({
    queryKey: ['invoice', id],
    queryFn: () => fetchInvoiceById(id)
  })

export const Route = createFileRoute('/_auth/_layout/invoices/$id')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(invoiceQuery(params.id)),
  component: Invoice
})

function Invoice() {
  const { id } = Route.useParams()
  const { data, isError, isLoading } = useSuspenseQuery(invoiceQuery(id))
  return (
    <div>
      {isError ? (
        'Error loading invoice'
      ) : isLoading ? (
        'Loading invoice'
      ) : (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  )
}
