import { z } from 'zod'
import { dateToZodDate, objectIdToString } from './common'

export const userSchema = z.object({
  _id: objectIdToString,
  name: z.string().min(2),
  email: z.string().email().optional(),
  password: z.string().min(6),
  role: z
    .union([z.literal('admin'), z.literal('user')])
    .optional()
    .default('user'),
  signatureUrl: z.string().optional(),
  createdAt: dateToZodDate,
  updatedAt: dateToZodDate
})

export const createUserSchema = userSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true
})

export const parseUserSchema = userSchema.omit({ password: true })

export const updateUserSchema = createUserSchema
  .omit({
    _id: true,
    role: true,
    signatureUrl: true,
    createdAt: true,
    updatedAt: true
  })
  .partial()

export type User = z.infer<typeof parseUserSchema>

export type Role = User['role']

export type CreateUser = z.input<typeof createUserSchema>

export type UpdateUser = z.infer<typeof updateUserSchema>
