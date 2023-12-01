import { Schema, model } from 'mongoose'
import { zodClientSchema, mongooseClientSchema } from './client'
import { zodUserShema, mongooseUserSchema } from './user'
import { z } from 'zod'

const zodInvoiceSchema = z.object({
  invoiceNo: z.string(),
  invoiceDate: z.date(),
  user: zodUserShema,
  client: zodClientSchema,
  items: z.array(
    z.object({
      itemName: z.string(),
      itemPrice: z.number()
    })
  ),
  totalAmount: z.number()
})

type InvoiceType = z.infer<typeof zodInvoiceSchema>

const mongooseInvoiceSchema = new Schema<InvoiceType>({
  invoiceNo: {
    type: String,
    required: true
  },
  invoiceDate: {
    type: Date,
    required: true
  },
  user: mongooseUserSchema,
  client: mongooseClientSchema,
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

const InvoiceModel = model<InvoiceType>('Invoice', mongooseInvoiceSchema)

export default InvoiceModel
