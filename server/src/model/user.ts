import bcrypt from 'bcrypt'
import { Schema, model, type Document, type Model } from 'mongoose'

type UserDocument = {
  userName: string
  password: string
  firstName: string
  lastName: string
  email: string
  role: 'admin' | 'user'
  signatureUrl: string
} & Document

export const UserSchema = new Schema<UserDocument>(
  {
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: {
      type: String
    },
    firstName: { type: String },
    lastName: { type: String },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    signatureUrl: { type: String, required: false }
  },
  { timestamps: true }
)

UserSchema.path('userName').validate(async (value: string) => {
  const user = await model<UserDocument>('User').findOne({ userName: value })
  return user === null
}, 'Duplicated userName')

UserSchema.path('email').validate(async (value: string) => {
  const user = await model<UserDocument>('User').findOne({ email: value })
  return user === null
}, 'Duplicated email')

// eslint-disable-next-line @typescript-eslint/promise-function-async
export function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 12, (err, hashedPassword) => {
      if (err !== undefined) {
        reject(err)
      } else {
        resolve(hashedPassword)
      }
    })
  })
}

UserSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    hashPassword(this.password)
      .then((hashedPassword) => {
        this.password = hashedPassword
        next()
      })
      .catch((e) => {
        next(e)
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
