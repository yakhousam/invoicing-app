import { z } from 'zod'
import { clientSchema } from './client'
import { dateToZodDate, objectIdSchema, objectIdToString } from './common'
import { userSchema } from './user'

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
  invoiceDate: dateToZodDate,
  invoiceDueDays: z.number(),
  user: userSchema.omit({ password: true }),
  client: clientSchema.pick({ _id: true, name: true }),
  items: z.array(itemSchema),
  paid: z.boolean(),
  status: z.enum(['sent', 'paid', 'overdue']),
  currency: z.enum(['USD', 'EUR', 'GBP']),
  taxPercentage: z.number().min(0).max(100),
  subTotal: z.number(),
  taxAmount: z.number(),
  totalAmount: z.number(),
  createdAt: dateToZodDate,
  updatedAt: dateToZodDate
})

export const invoiceArraySchema = z.array(
  invoiceSchema.omit({ user: true }).merge(z.object({ user: objectIdToString }))
)

export const createInvoiceSchema = z.object({
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

export const updateInvoice = createInvoiceSchema
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

export const invoicesSummarySchema = z.array(
  z.object({
    currency: createInvoiceSchema.shape.currency,
    total: z.number(),
    paid: z.number(),
    unpaid: z.number()
  })
)

export const invoicesTotalsByMonthSchema = z.array(
  z.object({
    date: z.object({
      month: z.number(),
      year: z.number()
    }),
    total: z.number(),
    paid: z.number(),
    unpaid: z.number()
  })
)

export const invoicesSearchSchema = z.object({
  page: z.number().int().nonnegative().catch(0),
  limit: z.number().int().positive().catch(10),
  sortBy: z
    .enum(['invoiceDate', 'invoiceNoString', 'totalAmount'])
    .catch('invoiceDate'),
  orderDirection: z.enum(['asc', 'desc']).catch('desc'),
  clientName: z.string().optional(),
  currency: z.enum(['USD', 'EUR', 'GBP']).optional()
})

export type Invoice = z.infer<typeof invoiceSchema>

export type CreateInvoice = z.input<typeof createInvoiceSchema>

export type UpdateInvoice = z.infer<typeof updateInvoice>

export type InvoicesSearchParams = z.input<typeof invoicesSearchSchema>
