import { type Client } from '@/model/client'
import InvoiceModel, { type Invoice } from '@/model/invoice'
import { type User } from '@/model/user'
import { type CreateInvoice } from '@/types'
import { zodCreatInvoiceSchema, zodUpdateInvoice } from '@/validation'
import { type NextFunction, type Request, type Response } from 'express'

const create = async (
  req: Request<null, null, CreateInvoice> & { user: User },
  res: Response,
  next: NextFunction
): Promise<void> => {
  const user = req.user
  try {
    const parsedData = zodCreatInvoiceSchema.parse({
      ...req.body,
      user: user._id.toString()
    })
    const invoice = new InvoiceModel(parsedData)
    const newInvoice = await invoice.save()
    res.status(201).json(newInvoice)
  } catch (error: unknown) {
    next(error)
  }
}

const find = async (
  req: Request & { user: User },
  res: Response,
  next: NextFunction
): Promise<void> => {
  const user = req.user
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
  req: Request<{ id: string }> & { user: User },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params
    const user = req.user
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
  req: Request<{ id: string }> & { user: User },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = zodUpdateInvoice.parse(req.body)
    const { id } = req.params
    const user = req.user

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
