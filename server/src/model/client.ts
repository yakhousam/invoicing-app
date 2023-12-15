import { Schema, model } from 'mongoose'
import { z } from 'zod'

export const zodClientSchema = z.object({
  name: z.string(),
  email: z.string().email().optional(),
  address: z.string().optional()
})

export type ClientType = z.infer<typeof zodClientSchema>

export const mongooseClientSchema = new Schema<ClientType>({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: false, unique: true, sparse: true },
  address: { type: String, required: false }
})

const ClientModel = model<ClientType>('Client', mongooseClientSchema)

export default ClientModel
