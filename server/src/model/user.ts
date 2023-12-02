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

mongooseUserSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    console.log('calling next!')
    // `return next();` will make sure the rest of this function doesn't run
    /* return */ next()
  }
  // Unless you comment out the `return` above, 'after next' will print
  console.log('after next')
}
)

const UserModel = model<UserType>('User', mongooseUserSchema)

export default UserModel
