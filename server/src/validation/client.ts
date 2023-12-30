import { z } from 'zod'

export const clientSchema = z.object({
  _id: z.preprocess((val: any) => val.toString(), z.string()),
  name: z.string(),
  email: z.string().email().optional(),
  address: z.string().optional()
})

export const createClientSchema = clientSchema.omit({ _id: true })

export type Client = z.infer<typeof clientSchema>

export type CreateClient = z.infer<typeof createClientSchema>
