import { type zodInvoiceSchema } from '@/validation'
import { Schema, model } from 'mongoose'
import { type z } from 'zod'

export type Invoice = z.infer<typeof zodInvoiceSchema> & {
  _id: string
}

const mongooseInvoiceSchema = new Schema<Invoice>(
  {
    invoiceNo: {
      type: Number
    },
    invoiceDate: {
      type: Date,
      default: Date.now
    },
    dueDate: {
      type: Date
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      immutable: true
    },
    client: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Client',
      immutable: true
    },
    items: [
      {
        itemName: String,
        itemPrice: Number,
        itemQuantity: {
          type: Number,
          default: 1
        }
      }
    ],
    totalAmount: {
      type: Number
    },
    paid: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret, options) {
        delete ret.id
        delete ret.user.password
        ret.items.forEach((item: { id: any }) => {
          delete item.id
        })
        return ret
      }
    }
  }
)

mongooseInvoiceSchema.path('user').validate(async (value) => {
  const user = await model('User').findById(value)
  return user !== null
}, 'Invalid User Id')

mongooseInvoiceSchema.path('client').validate(async (value) => {
  const client = await model('Client').findById(value)
  return client !== null
}, 'Invalid Client Id')

mongooseInvoiceSchema.pre('save', async function (next) {
  if (this.invoiceNo === undefined) {
    const currentYear = new Date().getFullYear()
    const countCurrentYearInvoices = await (
      this.constructor as typeof InvoiceModel
    )
      .find({
        user: this.user,
        invoiceDate: {
          $gte: new Date(currentYear, 0, 1), // Start of the current year
          $lte: new Date(currentYear, 11, 31) // End of the current year
        }
      })
      .countDocuments()
    this.invoiceNo = countCurrentYearInvoices + 1
  }

  const totalAmount = this.items.reduce(
    (acc, item) => acc + item.itemPrice * (item.itemQuantity ?? 1),
    0
  )
  this.totalAmount = totalAmount
  next()
})

mongooseInvoiceSchema.virtual('status').get(function () {
  const today = new Date()
  if (this.paid) {
    return 'paid'
  } else if (this.dueDate !== undefined && this.dueDate < today) {
    return 'overdue'
  } else {
    return 'sent'
  }
})

const InvoiceModel = model<Invoice>('Invoice', mongooseInvoiceSchema)

export default InvoiceModel
