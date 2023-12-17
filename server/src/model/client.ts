import { Schema, model } from 'mongoose'
import { z } from 'zod'

export const zodClientSchema = z.object({
  name: z.string(),
  email: z.string().email().optional(),
  address: z.string().optional()
})

export type Client = z.infer<typeof zodClientSchema>

export const mongooseClientSchema = new Schema<Client>({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: false, unique: true, sparse: true },
  address: { type: String, required: false }
})

const ClientModel = model<Client>('Client', mongooseClientSchema)

export default ClientModel
