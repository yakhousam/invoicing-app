import { Schema, model } from 'mongoose'

export type User = {
  name: string
  email: string
  password: string
}

export const UserSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }
})

const UserModel = model<User>('User', UserSchema)

export default UserModel
