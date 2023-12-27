import { type Client } from '@/model/client'
import InvoiceModel, { type Invoice } from '@/model/invoice'
import { type User } from '@/model/user'
import { zodCreatInvoiceSchema, zodUpdateInvoice } from '@/validation'
import { type NextFunction, type Request, type Response } from 'express'

export type CreateInvoiceRequest = Request<
  Record<string, unknown>,
  Record<string, unknown>,
  Pick<Invoice, 'items'> & {
    client: string
    invoiceDate?: string
  }
>
export type FindAllIvoicesRequest = Request

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
  const user = req.user as User
  try {
    const parsedData = zodCreatInvoiceSchema.parse({
      ...req.body,
      user: user._id.toString()
    })
    const invoice = new InvoiceModel(parsedData)
    const newInvoide = await invoice.save()
    res.status(201).json(newInvoide)
  } catch (error: unknown) {
    next(error)
  }
}

const find = async (
  req: FindAllIvoicesRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const user = req.user as User
  try {
    const invoices = await InvoiceModel.find({
      user: user._id
    })
    res.status(200).json(invoices)
  } catch (error: unknown) {
    next(error)
  }
}

// export type InvoiceFindById = Pick<
//   Invoice,
//   'invoiceNo' | 'invoiceDate' | 'dueDate' | 'paid' | 'totalAmount' | 'items'
// > & {
//   user: Omit<User, 'password'>
//   client: Client
// }

const findById = async (
  req: findInvoiceByIdRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params
    const user = req.user as User
    const invoice = await InvoiceModel.findOne<Invoice>({
      _id: id,
      user: user._id
    })
      .populate<{ user: User }>('user')
      .populate<{ client: Client }>('client')

    if (invoice === null) {
      res.status(404).json({
        error: 'Not found',
        message: `Invoice with id: ${id} not found`
      })
      return
    }
    res.status(200).json(invoice)
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
    const data = zodUpdateInvoice.parse(req.body)
    const { id } = req.params
    const user = req.user as User

    const invoice = await InvoiceModel.findOneAndUpdate<Invoice>(
      {
        _id: id,
        user: user._id
      },
      data,
      { new: true }
    )
    if (invoice === null) {
      res.status(404).json({
        error: 'Not found',
        message: `Invoice with id: ${id} not found`
      })
      return
    }
    res.status(200).json(invoice)
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
