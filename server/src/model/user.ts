import { type User } from '@/validation/user'
import bcrypt from 'bcrypt'
import { Schema, model, type Document, type Model } from 'mongoose'

type UserDocument = User & Document

export const UserSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, unique: true },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' }
  },
  { timestamps: true }
)

UserSchema.path('name').validate(async (value: string) => {
  const user = await model<User>('User').findOne({ name: value })
  return user === null
}, 'Duplicated name')

UserSchema.path('email').validate(async (value: string) => {
  const user = await model<User>('User').findOne({ email: value })
  return user === null
}, 'Duplicated email')

UserSchema.pre('save', function (next) {
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
})

UserSchema.methods.isValidPassword = async function (password: string) {
  const compare = await bcrypt.compare(password, this.password)
  return compare
}

type UserMethods = {
  isValidPassword: (password: string) => Promise<boolean>
}

type UserModel = Model<UserDocument, Record<string, unknown>, UserMethods>

const userModel = model<UserDocument, UserModel>('User', UserSchema)

export default userModel
