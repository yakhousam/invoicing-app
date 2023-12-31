import bcrypt from 'bcrypt'
import { Schema, model, type Document, type Model } from 'mongoose'

type UserDocument = {
  name: string
  email: string
  password: string
  role: 'admin' | 'user'
} & Document

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
  const user = await model<UserDocument>('User').findOne({ name: value })
  return user === null
}, 'Duplicated name')

UserSchema.path('email').validate(async (value: string) => {
  const user = await model<UserDocument>('User').findOne({ email: value })
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
UserSchema.methods.toJSON = function () {
  const user = this.toObject()
  delete user.password
  return user
}

type UserMethods = {
  isValidPassword: (password: string) => Promise<boolean>
  toJSON: () => Record<string, unknown>
}

type UserModel = Model<UserDocument, Record<string, unknown>, UserMethods>

const userModel = model<UserDocument, UserModel>('User', UserSchema)

export default userModel
