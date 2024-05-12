import { invoicesQueryOptions } from '@/invoicesQueryOptions'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/_layout/')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(invoicesQueryOptions)
})
