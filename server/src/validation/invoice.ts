import { Types } from 'mongoose'
import { z } from 'zod'

export const zodInvoiceSchema = z.object({
  invoiceNo: z.number(),
  invoiceDate: z
    .string()
    .datetime()
    .optional()
    .transform((val) => {
      return val !== undefined ? new Date(val) : new Date()
    }),
  invoiceDueDays: z.number().min(1).optional().default(7),
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
      itemQuantity: z.coerce.number().positive().optional().default(1)
    })
  ),
  totalAmount: z.number(),
  paid: z.boolean()
})

export const zodCreatInvoiceSchema = zodInvoiceSchema
  .pick({
    invoiceDate: true,
    invoiceDueDays: true,
    items: true,
    client: true,
    user: true
  })
  .refine(
    (data) => {
      return data.items.length !== 0
    },
    { message: 'Invoice must have at least one item.', path: ['items'] }
  )

export const zodUpdateInvoice = zodInvoiceSchema
  .pick({
    invoiceDueDays: true,
    invoiceDate: true,
    items: true
  })
  .extend({
    paid: z
      .boolean()
      .optional()
      .refine((value) => value, {
        message: 'Paid status can only be set to true.',
        path: ['paid']
      })
  })
  .partial()

export type Invoice = z.infer<typeof zodInvoiceSchema> & { _id: string }

export type CreateInvoice = Omit<z.input<typeof zodCreatInvoiceSchema>, 'user'>

export type UpdateInvoice = z.input<typeof zodUpdateInvoice>
