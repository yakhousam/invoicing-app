import { type Client } from '@/validation/client'
import { Schema, model, type Document } from 'mongoose'

type ClientDocument = Omit<Client, 'userId'> & {
  userId: Schema.Types.ObjectId
} & Document

const ClientSchema = new Schema<ClientDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: false, sparse: true },
    address: { type: String, required: false, default: '' },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
)

ClientSchema.index({ name: 1, userId: 1 }, { unique: true })
ClientSchema.index({ email: 1, userId: 1 }, { unique: true, sparse: true })

// only insert email if it is not empty string
ClientSchema.pre('save', function (next) {
  if (this.email === '') {
    this.email = undefined
  }
  next()
})

const clientModel = model<ClientDocument>('Client', ClientSchema)

export default clientModel
