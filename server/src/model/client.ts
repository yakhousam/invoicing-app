import { type Client } from '@/validation/client'
import { Schema, model, type Document } from 'mongoose'

type ClientDocument = Client & Document

const ClientSchema = new Schema<ClientDocument>({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: false, unique: true, sparse: true },
  address: { type: String, required: false }
})

const clientModel = model<ClientDocument>('Client', ClientSchema)

export default clientModel
