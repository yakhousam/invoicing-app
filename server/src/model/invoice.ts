import { Schema, model } from 'mongoose'
import { ClientSchema, type Client } from './client'
import { UserSchema, type User } from './user'

type Invoice = {
  id: string
  invoiceNo: string
  invoiceDate: Date
  user: User
  client: Client
  items: Array<{
    itemName: string
    itemPrice: number
  }>
  totalAmount: number
}

const invoiceSchema = new Schema<Invoice>({
  invoiceNo: {
    type: String,
    required: true
  },
  invoiceDate: {
    type: Date,
    required: true
  },
  user: UserSchema,
  client: ClientSchema,
  items: [
    {
      itemName: String,
      itemPrice: Number
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  }
})

const InvoiceModel = model<Invoice>('Invoice', invoiceSchema)

export default InvoiceModel
