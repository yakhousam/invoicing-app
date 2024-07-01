import { z } from 'zod'
import { dateToZodDate, objectIdToString } from './common'

export const clientSchema = z.object({
  _id: objectIdToString,
  userId: objectIdToString,
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.union([z.string().email(), z.literal(''), z.undefined()]),
  address: z.string().optional(),
  createdAt: dateToZodDate,
  updatedAt: dateToZodDate
})

export const createClientSchema = clientSchema.omit({
  _id: true,
  userId: true,
  createdAt: true,
  updatedAt: true
})

export const clientArraySchema = z.array(clientSchema)

export const updateClientSchema = clientSchema.omit({
  _id: true,
  userId: true,
  createdAt: true,
  updatedAt: true
})

export type Client = z.infer<typeof clientSchema>

export type CreateClient = z.infer<typeof createClientSchema>

export type UpdateClient = z.infer<typeof updateClientSchema>
