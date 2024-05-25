import { z } from 'zod'
import { dateToZodDatetime, objectIdToString } from './common'

export const clientSchema = z.object({
  _id: objectIdToString,
  userId: objectIdToString,
  name: z.string().min(2),
  email: z.union([z.string().email(), z.literal(''), z.undefined()]),
  address: z.string().optional(),
  createdAt: dateToZodDatetime,
  updatedAt: dateToZodDatetime
})

export const createClientSchema = clientSchema.omit({
  _id: true,
  userId: true,
  createdAt: true,
  updatedAt: true
})

export const clientArraySchema = z.array(clientSchema)

export type Client = z.infer<typeof clientSchema>

export type CreateClient = z.infer<typeof createClientSchema>
