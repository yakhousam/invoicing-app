import { z } from 'zod'
import { dateToZodDate, objectIdToString } from './common'

export const userSchema = z.object({
  _id: objectIdToString,
  userName: z.string().min(2),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
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
    role: true,
    signatureUrl: true,
    password: true
  })
  .partial()

export const updateUserPasswordSchema = z
  .object({
    oldPassword: z.string().min(6),
    newPassword: z.string().min(6),
    confirmNewPassword: z.string().min(6)
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ['confirmNewPassword']
  })

export type User = z.infer<typeof parseUserSchema>

export type Role = User['role']

export type CreateUser = z.input<typeof createUserSchema>

export type UpdateUser = z.infer<typeof updateUserSchema>

export type UpdateUserPassword = z.infer<typeof updateUserPasswordSchema>
