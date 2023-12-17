import { type NextFunction, type Request, type Response } from 'express'
import InvoiceModel, { type Invoice, zodInvoiceSchema } from '@/model/invoice'

export type CreateInvoiceRequest = Request<
  Record<string, unknown>,
  Record<string, unknown>,
  Pick<Invoice, 'items'> & {
    user: string
    client: string
    invoiceDate?: string
  }
>
export type findInvoiceByIdRequest = Request<
  { id: string },
  Record<string, unknown>,
  Record<string, unknown>
>

const create = async (
  req: CreateInvoiceRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    zodInvoiceSchema.parse(req.body)
    const invoice = new InvoiceModel(req.body)
    const newInvoide = await invoice.save()
    res.status(201).json(newInvoide)
  } catch (error: unknown) {
    // console.error(error)
    next(error)
  }
}

const find = async (
  req: unknown,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const invoices = await InvoiceModel.find()
    res.status(200).json(invoices)
  } catch (error: unknown) {
    next(error)
  }
}

const findById = async (
  req: findInvoiceByIdRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params
    const invoice = await InvoiceModel.findById(id)
      .populate('user')
      .populate('client')
    if (invoice !== null) {
      res.status(200).json(invoice)
    } else {
      res.status(404).json({
        error: 'Not found',
        message: `Invoice with id: ${id} not found`
      })
    }
  } catch (error: unknown) {
    next(error)
  }
}

const updateById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = zodInvoiceSchema.parse(req.body)
    const { id } = req.params
    const updatedInvoice = await InvoiceModel.findByIdAndUpdate(id, data)
    if (updatedInvoice !== null) {
      res.status(200).json(updatedInvoice)
    } else {
      res.status(404).json({
        error: 'Not found',
        message: `Invoice with id: ${id} not found`
      })
    }
  } catch (error) {
    next(error)
  }
}

const invoiceController = {
  create,
  find,
  findById,
  updateById
}

export default invoiceController
