import { z } from 'zod'

export const invoiceSchema = z.object({
  _id: z.preprocess((val: any) => val.toString(), z.string()),
  invoiceNo: z.number(),
  invoiceDate: z.date(),
  invoiceDueDays: z.number().min(1).optional().default(7),
  user: z.preprocess((val: any) => val?.toString(), z.string().min(24)),
  client: z.preprocess((val: any) => val?.toString(), z.string().min(24)),
  items: z.array(
    z.object({
      itemName: z.string(),
      itemPrice: z.coerce.number().positive(),
      itemQuantity: z.coerce.number().positive().optional().default(1)
    })
  ),
  totalAmount: z.number(),
  paid: z.boolean(),
  status: z.enum(['sent', 'paid', 'overdue']).default('sent')
})

export const invoiceArraySchema = z.array(invoiceSchema)

export const creatInvoiceSchema = invoiceSchema
  .pick({
    invoiceDueDays: true,
    items: true,
    client: true
  })
  .extend({
    invoiceDate: z
      .string()
      .datetime()
      .optional()
      .default(new Date().toISOString())
  })
  .refine(
    (data) => {
      return data.items.length !== 0
    },
    { message: 'Invoice must have at least one item.', path: ['items'] }
  )

export const updateInvoice = invoiceSchema
  .pick({
    invoiceDueDays: true,
    items: true
  })
  .extend({
    invoiceDate: z
      .string()
      .datetime()
      .optional()
      .default(new Date().toISOString()),
    paid: z
      .boolean()
      .optional()
      .refine((value) => value, {
        message: 'Paid status can only be set to true.',
        path: ['paid']
      })
  })
  .partial()

export type Invoice = z.infer<typeof invoiceSchema>

export type CreateInvoice = z.input<typeof creatInvoiceSchema>

export type UpdateInvoice = z.input<typeof updateInvoice>
