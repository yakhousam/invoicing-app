import bcrypt from 'bcrypt'
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
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: { type: String, required: true }
})

mongooseUserSchema.path('email').validate(async (value) => {
  const user = await model<UserType>('User').findOne({ email: value })
  return user === null
}, 'Duplicated email')

mongooseUserSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    bcrypt.hash(this.password, 12, (err, hashedPassword) => {
      if (err !== undefined) {
        next(err)
      } else {
        this.password = hashedPassword
        next()
      }
    })
  }
}
)

const UserModel = model<UserType>('User', mongooseUserSchema)

export default UserModel
