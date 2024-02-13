import { z } from 'zod'
import { clientSchema } from './client'
import { dateToZodDatetime, objectIdSchema, objectIdToString } from './common'
import { userShema } from './user'

const itemSchema = z.object({
  _id: objectIdToString,
  itemName: z.string(),
  itemPrice: z.coerce.number().positive(),
  itemQuantity: z.coerce.number().positive().optional().default(1)
})

export const invoiceSchema = z.object({
  _id: objectIdToString,
  invoiceNo: z.number(),
  invoiceDate: dateToZodDatetime,
  invoiceDueDays: z.number(),
  user: userShema.omit({ password: true }),
  client: clientSchema,
  items: z.array(itemSchema),
  totalAmount: z.number(),
  paid: z.boolean(),
  status: z.enum(['sent', 'paid', 'overdue']),
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
      message: 'Invoice must have at least one item.',
      path: ['items']
    }),
  client: objectIdSchema
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
