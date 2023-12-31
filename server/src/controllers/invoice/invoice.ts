import InvoiceModel from '@/model/invoice'
import {
  creatInvoiceSchema,
  invoiceArraySchema,
  invoiceSchema,
  updateInvoice,
  type Invoice
} from '@/validation'
import { type Client } from '@/validation/client'
import { parseUserSchema, type User } from '@/validation/user'
import { type NextFunction, type Request, type Response } from 'express'

const create = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authenticatedUser = parseUserSchema.parse(req.user)
    const parsedInvoiceData = creatInvoiceSchema.parse(req.body)
    const newInvoice = new InvoiceModel({
      ...parsedInvoiceData,
      user: authenticatedUser._id
    })
    const savedInvoice = await newInvoice.save()

    const populatedInvoice = await InvoiceModel.findById(savedInvoice._id)
      .populate('user', '-password')
      .populate('client')

    if (populatedInvoice === null) {
      throw new Error('Invoice not found')
    }
    const jsonResponse = invoiceSchema.parse(populatedInvoice.toJSON())
    res.status(201).json(jsonResponse)
  } catch (error: unknown) {
    next(error)
  }
}

const find = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authenticatedUser = parseUserSchema.parse(req.user)
    const invoices = await InvoiceModel.find({
      user: authenticatedUser._id
    })
      .populate<{ user: User }>('user', '-password')
      .populate<{ client: Client }>('client')
    const jsonResponse = invoiceArraySchema.parse(invoices)
    res.status(200).json(jsonResponse)
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
    const authenticatedUser = parseUserSchema.parse(req.user)
    const invoice = await InvoiceModel.findOne<Invoice>({
      _id: id,
      user: authenticatedUser._id
    })
      .populate<{ user: User }>('user', '-password')
      .populate<{ client: Client }>('client')

    if (invoice === null) {
      res.status(404).json({
        error: 'Not found',
        message: `Invoice with id: ${id} not found`
      })
      return
    }
    const jsonResponse = invoiceSchema.parse(invoice)
    res.status(200).json(jsonResponse)
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
    const authenticatedUser = parseUserSchema.parse(req.user)

    const invoice = await InvoiceModel.findOneAndUpdate<Invoice>(
      {
        _id: id,
        user: authenticatedUser._id
      },
      data,
      { new: true }
    )
      .populate<{ user: User }>('user', '-password')
      .populate<{ client: Client }>('client')

    if (invoice === null) {
      res.status(404).json({
        error: 'Not found',
        message: `Invoice with id: ${id} not found`
      })
      return
    }

    const jsonResponse = invoiceSchema.parse(invoice)
    res.status(200).json(jsonResponse)
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
