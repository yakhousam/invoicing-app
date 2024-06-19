import { invoicesOptions } from '@/queries'
import { invoicesSearchSchema } from '@/validations'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/_layout/')({
  loader: ({ context: { queryClient } }) => {
    const search = invoicesSearchSchema.parse({})
    queryClient.ensureQueryData(invoicesOptions(search))
  }
})
