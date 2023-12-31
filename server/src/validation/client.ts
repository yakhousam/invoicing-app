import { z } from 'zod'
import { dateToZodDatetime, objectIdToString } from './common'

export const clientSchema = z.object({
  _id: objectIdToString,
  name: z.string(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  createdAt: dateToZodDatetime,
  updatedAt: dateToZodDatetime
})

export const createClientSchema = clientSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true
})

export type Client = z.infer<typeof clientSchema>

export type CreateClient = z.infer<typeof createClientSchema>
