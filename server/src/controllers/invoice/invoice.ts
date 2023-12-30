import InvoiceModel from '@/model/invoice'
import { creatInvoiceSchema, updateInvoice, type Invoice } from '@/validation'
import { type Client } from '@/validation/client'
import { parseUserSchema, type User } from '@/validation/user'
import { type NextFunction, type Request, type Response } from 'express'

const create = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const user = parseUserSchema.parse(req.user)
  try {
    const parsedData = creatInvoiceSchema.parse(req.body)
    const invoice = new InvoiceModel({ ...parsedData, user: user._id })
    const newInvoice = await invoice.save()
    res.status(201).json(newInvoice)
  } catch (error: unknown) {
    next(error)
  }
}

const find = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const user = parseUserSchema.parse(req.user)
  try {
    const invoices = await InvoiceModel.find({
      user: user._id
    })
    res.status(200).json(invoices)
  } catch (error: unknown) {
    next(error)
  }
}

const findById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params
    const user = parseUserSchema.parse(req.user)
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
    const data = updateInvoice.parse(req.body)
    const { id } = req.params
    const user = parseUserSchema.parse(req.user)

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
