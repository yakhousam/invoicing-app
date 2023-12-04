import { Schema, model } from 'mongoose'
import { z } from 'zod'

export const zodInvoiceSchema = z.object({
  invoiceDate: z.coerce.date(),
  userId: z.string(),
  clientId: z.string(),
  items: z.array(
    z.object({
      itemName: z.string(),
      itemPrice: z.coerce.number()
    })
  )
})

export type InvoiceType = z.infer<typeof zodInvoiceSchema>

type SchemaType = InvoiceType & {
  invoiceNo: string
  totalAmount: number
}

const mongooseInvoiceSchema = new Schema<SchemaType>({
  invoiceNo: {
    type: String
  },
  invoiceDate: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  clientId: {
    type: String,
    required: true,
    ref: 'Client'
  },
  items: [
    {
      itemName: String,
      itemPrice: Number
    }
  ],
  totalAmount: {
    type: Number
  }
})

mongooseInvoiceSchema.pre('save', async function (next) {
  const Model = this.constructor as typeof InvoiceModel
  const currentYear = new Date().getFullYear()
  const invoiceNo = await Model.find({
    invoiceDate: {
      $gte: new Date(currentYear, 0, 1), // Start of the current year
      $lte: new Date(currentYear, 11, 31) // End of the current year
    }
  }).countDocuments() + 1

  this.invoiceNo = `${invoiceNo}`

  const totalAmount = this.items.reduce((acc, item) => acc + item.itemPrice, 0)
  this.totalAmount = totalAmount
  next()
}
)

const InvoiceModel = model<SchemaType>('Invoice', mongooseInvoiceSchema)

export default InvoiceModel
