import { z } from 'zod'
import { clientSchema } from './client'
import { dateToZodDatetime, objectIdSchema, objectIdToString } from './common'
import { userShema } from './user'

const itemSchema = z.object({
  _id: objectIdToString,
  itemName: z.string().min(1),
  itemPrice: z.coerce.number().positive(),
  itemQuantity: z.coerce.number().positive().optional().default(1)
})

export const invoiceSchema = z.object({
  _id: objectIdToString,
  invoiceNo: z.number(),
  invoiceNoString: z.string(),
  invoiceDate: dateToZodDatetime,
  invoiceDueDays: z.number(),
  user: userShema.omit({ password: true }),
  client: clientSchema.pick({ _id: true, name: true }),
  items: z.array(itemSchema),
  paid: z.boolean(),
  status: z.enum(['sent', 'paid', 'overdue']),
  currency: z.enum(['USD', 'EUR', 'GBP']),
  taxPercentage: z.number().min(0).max(100),
  subTotal: z.number(),
  taxAmount: z.number(),
  totalAmount: z.number(),
  createdAt: dateToZodDatetime,
  updatedAt: dateToZodDatetime
})

export const invoiceArraySchema = z.array(
  invoiceSchema.omit({ user: true }).merge(z.object({ user: objectIdToString }))
)

export const creatInvoiceSchema = z.object({
  invoiceDate: z
    .string()
    .datetime()
    .optional()
    .default(new Date().toISOString()),
  invoiceDueDays: z.number().min(1).optional().default(7),
  items: z
    .array(itemSchema.omit({ _id: true }))
    .refine((items) => items.length !== 0, {
      message: 'Invoice must have at least one item.'
    }),
  client: z.object({
    _id: objectIdSchema
  }),
  currency: z.enum(['USD', 'EUR', 'GBP']),
  taxPercentage: z.number().min(0).max(100).optional().default(0)
})

export const updateInvoice = creatInvoiceSchema
  .omit({ client: true })
  .partial()
  .extend({
    paid: z
      .boolean()
      .optional()
      .refine((value) => value === true || value === undefined, {
        message: 'Paid status can only be set to true.',
        path: ['paid']
      })
  })

export type Invoice = z.infer<typeof invoiceSchema>

export type CreateInvoice = z.input<typeof creatInvoiceSchema>

export type UpdateInvoice = z.infer<typeof updateInvoice>
