import { z } from 'zod'

const userShema = z.object({
  _id: z.preprocess((val: any) => val.toString(), z.string()),
  name: z.string(),
  email: z.string().email().optional(),
  password: z.string().min(6),
  role: z
    .union([z.literal('admin'), z.literal('user')])
    .optional()
    .default('user')
})

export const createUserSchema = userShema.omit({ _id: true })

export const parseUserSchema = userShema.omit({ password: true })

export type User = z.infer<typeof userShema>

export type CreateUser = z.input<typeof createUserSchema>

export type UpdateUser = Partial<CreateUser>
