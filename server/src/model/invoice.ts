import { type Invoice } from '@/validation'
import { Schema, model, type Document } from 'mongoose'

type InvoiceDocument = Invoice & Document

const InvoiceSchema = new Schema<InvoiceDocument>(
  {
    invoiceNo: {
      type: Number
    },
    invoiceDate: {
      type: Date,
      default: Date.now
    },
    invoiceDueDays: {
      type: Number
    },
    user: {
      type: String,
      required: true,
      ref: 'User',
      immutable: true
    },
    client: {
      type: String,
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
  { timestamps: true }
)

InvoiceSchema.path('user').validate(async (value) => {
  const user = await model('User').findById(value)
  return user !== null
}, 'Invalid User Id')

InvoiceSchema.path('client').validate(async (value) => {
  const client = await model('Client').findById(value)
  return client !== null
}, 'Invalid Client Id')

InvoiceSchema.pre('save', async function (next) {
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

InvoiceSchema.virtual('status').get(function () {
  const today = new Date()
  if (this.paid) {
    return 'paid'
  } else if (
    new Date(
      new Date(this.invoiceDate).getTime() +
        this.invoiceDueDays * 24 * 60 * 60 * 1000
    ) < today
  ) {
    return 'overdue'
  } else {
    return 'sent'
  }
})

const InvoiceModel = model<InvoiceDocument>('Invoice', InvoiceSchema)

export default InvoiceModel
