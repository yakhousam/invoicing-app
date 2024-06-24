import { Schema, model, type Document } from 'mongoose'

type InvoiceDocument = {
  invoiceNo: number
  invoiceNoString: string
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
  paid: boolean
  currency: string
  subTotal: number
  taxPercentage: number
  taxAmount: number
  totalAmount: number
} & Document

const InvoiceSchema = new Schema<InvoiceDocument>(
  {
    invoiceNo: {
      type: Number
    },
    invoiceNoString: {
      type: String
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
    paid: {
      type: Boolean,
      default: false
    },
    currency: {
      type: String,
      enum: ['USD', 'EUR', 'GBP'],
      default: 'USD'
    },
    subTotal: {
      type: Number,
      default: 0
    },
    taxPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    taxAmount: {
      type: Number
    },
    totalAmount: {
      type: Number
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
    const fullYear = new Date(this.invoiceDate).getFullYear()
    const [maxInvoiceNo] = await (this.constructor as typeof InvoiceModel)
      .find({
        user: this.user,
        invoiceDate: {
          $gte: new Date(fullYear, 0, 1, 0, 0, 0), // Start of the current year
          $lte: new Date(fullYear, 11, 31, 23, 59, 59) // End of the current year
        }
      })
      .sort({ invoiceNo: -1 })
      .limit(1)
      .select('invoiceNo')
      .lean()

    const invoiceNumber = (maxInvoiceNo?.invoiceNo ?? 0) + 1

    this.invoiceNo = invoiceNumber
    this.invoiceNoString = `${fullYear}-${String(invoiceNumber).padStart(
      4,
      '0'
    )}`
  }
  const invoiceDate =
    this.invoiceDate !== undefined ? new Date(this.invoiceDate) : new Date()

  this.invoiceDate = invoiceDate
  const subTotal = parseFloat(
    this.items
      .reduce(
        (acc, item) =>
          acc +
          parseFloat((item.itemPrice * (item.itemQuantity ?? 1)).toFixed(2)),
        0
      )
      .toFixed(2)
  )

  const taxAmount =
    this.taxPercentage > 0
      ? parseFloat(((subTotal * this.taxPercentage) / 100).toFixed(2))
      : 0

  this.subTotal = subTotal
  this.taxAmount = taxAmount
  this.totalAmount = parseFloat((subTotal + taxAmount).toFixed(2))
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
