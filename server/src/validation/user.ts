import { z } from 'zod'
import { dateToZodDatetime, objectIdToString } from './common'

export const userShema = z.object({
  _id: objectIdToString,
  name: z.string(),
  email: z.string().email().optional(),
  password: z.string().min(6),
  role: z
    .union([z.literal('admin'), z.literal('user')])
    .optional()
    .default('user'),
  createdAt: dateToZodDatetime,
  updatedAt: dateToZodDatetime
})

export const createUserSchema = userShema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true
})

export const parseUserSchema = userShema.omit({ password: true })

export const updateUserSchema = createUserSchema.omit({ role: true }).partial()

export type User = z.infer<typeof userShema>

export type Role = User['role']

export type CreateUser = z.input<typeof createUserSchema>

export type UpdateUser = z.infer<typeof updateUserSchema>
