import { Schema, model } from 'mongoose'

export type Client = {
  name: string
  email?: string
  address?: string
}

export const ClientSchema = new Schema<Client>({
  name: { type: String, required: true },
  email: { type: String, required: false },
  address: { type: String, required: false }
})

const ClientModel = model<Client>('Client', ClientSchema)

export default ClientModel
