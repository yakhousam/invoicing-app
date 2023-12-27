import { Types } from 'mongoose'
import { z } from 'zod'

export const zodInvoiceSchema = z.object({
  invoiceNo: z.number().optional(),
  invoiceDate: z.coerce
    .date()
    .optional()
    .default(() => new Date()),
  dueDate: z.coerce.date().optional(),
  user: z
    .string()
    .min(24)
    .max(24)
    .transform((value) => new Types.ObjectId(value)),
  client: z
    .string()
    .min(24)
    .max(24)
    .transform((value) => new Types.ObjectId(value)),
  items: z.array(
    z.object({
      itemName: z.string(),
      itemPrice: z.coerce.number().positive(),
      itemQuantity: z.coerce.number().positive().optional()
    })
  ),
  totalAmount: z.number().optional(),
  paid: z.boolean().optional().default(false)
})

export const zodCreatInvoiceSchema = zodInvoiceSchema
  .refine(
    (data) => {
      if (data.dueDate === undefined) {
        data.dueDate = new Date(
          new Date(data.invoiceDate).getTime() + 7 * 24 * 60 * 60 * 1000
        )
      }
      return data.invoiceDate <= data.dueDate
    },
    { message: 'Invoice date must be before due date.', path: ['dueDate'] }
  )
  .refine(
    (data) => {
      return data.invoiceNo === undefined && data.totalAmount === undefined
    },
    {
      message:
        'InvoiceNo and TotalAmount are automatically generated and cannot be set.',
      path: ['invoiceNo', 'totalAmount']
    }
  )
  .refine(
    (data) => {
      return data.items.length !== 0
    },
    { message: 'Invoice must have at least one item.', path: ['items'] }
  )

export const zodUpdateInvoice = zodInvoiceSchema
  .pick({
    dueDate: true,
    invoiceDate: true,
    items: true
  })
  .merge(
    z.object({
      paid: z.boolean().refine((value) => value, {
        message: 'Paid status can only be set to true.',
        path: ['paid']
      })
    })
  )
  .partial()

export type UpdateInvoice = z.infer<typeof zodUpdateInvoice>
