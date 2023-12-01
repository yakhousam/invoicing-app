import { Schema, model } from 'mongoose'
import { z } from 'zod'

export const zodUserShema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6)
})

export type UserType = z.infer<typeof zodUserShema>

export const mongooseUserSchema = new Schema<UserType>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }
})

const UserModel = model<UserType>('User', mongooseUserSchema)

export default UserModel
