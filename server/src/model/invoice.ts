import { Schema, model, type Document } from 'mongoose'

type InvoiceDocument = {
  invoiceNo: number
  invoiceDate: Date
  invoiceDueDays: number
  user: Schema.Types.ObjectId
  client: {
    _id: Schema.Types.ObjectId
    name: string
  }
  items: Array<{
    itemName: string
    itemPrice: number
    itemQuantity: number
  }>
  totalAmount: number
  paid: boolean
  currency: string
  taxPercentage: number
} & Document

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
      type: Number,
      default: 7
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      immutable: true
    },
    client: {
      _id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Client',
        immutable: true
      },
      name: {
        type: String
      }
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
    },
    currency: {
      type: String,
      enum: ['USD', 'EUR', 'GBP'],
      default: 'USD'
    },
    taxPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
  { timestamps: true, toJSON: { virtuals: true } }
)

InvoiceSchema.pre('save', async function (next) {
  if (this.isNew) {
    const client = await model('Client').findById(this.client._id)
    if (client !== null) {
      this.client.name = client.name
    }
  }
  next()
})

InvoiceSchema.path('user').validate(async (value) => {
  const user = await model('User').findById(value)
  return user !== null
}, 'Invalid User Id')

InvoiceSchema.path('client._id').validate(async (value) => {
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
          $gte: new Date(currentYear, 0, 1, 0, 0, 0), // Start of the current year
          $lte: new Date(currentYear, 11, 31, 23, 59, 59) // End of the current year
        }
      })
      .countDocuments()

    this.invoiceNo = countCurrentYearInvoices + 1
  }
  const totalAmount = this.items.reduce(
    (acc, item) => acc + item.itemPrice * (item.itemQuantity ?? 1),
    0
  )
  if (this.taxPercentage > 0) {
    this.totalAmount = totalAmount + (totalAmount * this.taxPercentage) / 100
  } else {
    this.totalAmount = totalAmount
  }
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
