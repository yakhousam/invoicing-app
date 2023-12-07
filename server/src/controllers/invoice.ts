import { type Request, type Response } from 'express'
import InvoiceModel, { type InvoiceType, zodInvoiceSchema } from '@/model/invoice'

type CreateInvoiceRequest = Request<Record<string, unknown>, Record<string, unknown>, InvoiceType>

const create = (req: CreateInvoiceRequest, res: Response): void => {
  try {
    zodInvoiceSchema.parse(req.body)
    const invoice = new InvoiceModel(req.body)
    invoice.save()
      .then(invoice => res.status(201).json(invoice))
      .catch((e) => res.status(409).json(e))
  } catch (error) {
    res.status(400).send(error)
  }
}

const Invoice = {
  create
}

export default Invoice
