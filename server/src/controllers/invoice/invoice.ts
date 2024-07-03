import InvoiceModel from '@/model/invoice'
import {
  createInvoiceSchema,
  invoiceArraySchema,
  invoiceSchema,
  invoicesSearchSchema,
  invoicesSummarySchema,
  updateInvoice,
  type Invoice
} from '@/validation'
import { parseUserSchema, type User } from '@/validation/user'
import { type NextFunction, type Request, type Response } from 'express'
import { ObjectId } from 'mongodb'

const create = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authenticatedUser = parseUserSchema.parse(req.user)
    const parsedInvoiceData = createInvoiceSchema.parse(req.body)
    const newInvoice = new InvoiceModel({
      ...parsedInvoiceData,
      user: authenticatedUser._id
    })
    const savedInvoice = await newInvoice.save()

    const populatedInvoice = await InvoiceModel.findById(
      savedInvoice._id
    ).populate('user', '-password')

    if (populatedInvoice === null) {
      throw new Error('Invoice not found')
    }
    const jsonResponse = invoiceSchema.parse(populatedInvoice.toJSON())
    res.status(201).json(jsonResponse)
  } catch (error: unknown) {
    next(error)
  }
}

const findAll = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authenticatedUser = parseUserSchema.parse(req.user)
    const searchQuery = invoicesSearchSchema.parse({
      ...req.query,
      page: Number(req.query.page),
      limit: Number(req.query.limit)
    })
    const {
      page,
      limit,
      sortBy,
      orderDirection,
      status,
      clientName,
      currency
    } = searchQuery

    const aggregationPipeline: any[] = [
      { $match: { user: new ObjectId(authenticatedUser._id) } }
    ]

    if (currency !== undefined) {
      aggregationPipeline.push({ $match: { currency } })
    }

    if (clientName !== undefined) {
      aggregationPipeline.push({
        $match: {
          'client.name': { $regex: clientName, $options: 'i' }
        }
      })
    }

    aggregationPipeline.push({
      $addFields: {
        status: {
          $cond: [
            { $eq: ['$paid', true] },
            'paid',
            {
              $cond: [
                {
                  $lt: [
                    {
                      $add: [
                        { $toDate: '$invoiceDate' },
                        {
                          $multiply: ['$invoiceDueDays', 24 * 60 * 60 * 1000]
                        }
                      ]
                    },
                    new Date()
                  ]
                },
                'overdue',
                'sent'
              ]
            }
          ]
        }
      }
    })

    if (status !== undefined) {
      aggregationPipeline.push({ $match: { status } })
    }

    aggregationPipeline.push({
      $facet: {
        paginatedResults: [
          { $sort: { [sortBy]: orderDirection === 'asc' ? 1 : -1 } },
          { $skip: page * limit },
          { $limit: limit }
        ],
        totalCount: [{ $count: 'count' }]
      }
    })

    const aggregation = await InvoiceModel.aggregate(aggregationPipeline)

    const invoices = invoiceArraySchema.parse(aggregation[0].paginatedResults)
    const totalInvoices = aggregation[0].totalCount[0]?.count ?? 0

    res.status(200).json({
      invoices,
      totalInvoices
    })
  } catch (error: unknown) {
    // console.log(error)
    next(error)
  }
}

const findOne = async (
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
    }).populate<{ user: User }>('user', '-password')

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

const updateOne = async (
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
    ).populate<{ user: User }>('user', '-password')

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

const deleteOne = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params
    const authenticatedUser = parseUserSchema.parse(req.user)

    const invoice = await InvoiceModel.findOne({
      _id: id,
      user: authenticatedUser._id
    })

    if (invoice === null) {
      res.status(404).json({
        error: 'Not found',
        message: `Invoice with id: ${id} not found`
      })
      return
    }

    if (invoice.paid) {
      res.status(400).json({
        error: 'Bad request',
        message: `Invoice with id: ${id} is already paid, can't delete it`
      })
      return
    }
    await invoice.deleteOne()

    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}

const getSummary = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authenticatedUser = parseUserSchema.parse(req.user)

    const totals = await InvoiceModel.aggregate([
      {
        $match: {
          user: new ObjectId(authenticatedUser._id)
        }
      },
      {
        $group: {
          _id: '$currency',
          total: { $sum: '$totalAmount' },
          paid: { $sum: { $cond: ['$paid', '$totalAmount', 0] } },
          unpaid: { $sum: { $cond: ['$paid', 0, '$totalAmount'] } }
        }
      },
      {
        $project: {
          _id: 0,
          currency: '$_id',
          total: 1,
          paid: 1,
          unpaid: 1
        }
      }
    ])

    const jsonResponse = invoicesSummarySchema.parse(totals)

    res.status(200).json(jsonResponse)
  } catch (error) {
    next(error)
  }
}

const getTotalsByMonth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authenticatedUser = parseUserSchema.parse(req.user)

    const totals = await InvoiceModel.aggregate([
      {
        $match: {
          user: new ObjectId(authenticatedUser._id)
        }
      },
      {
        $group: {
          _id: {
            month: { $month: '$invoiceDate' },
            year: { $year: '$invoiceDate' }
          },
          total: { $sum: '$totalAmount' },
          paid: { $sum: { $cond: ['$paid', '$totalAmount', 0] } },
          unpaid: { $sum: { $cond: ['$paid', 0, '$totalAmount'] } }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1
        }
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          total: 1,
          paid: 1,
          unpaid: 1
        }
      }
    ])

    res.status(200).json(totals)
  } catch (error) {
    next(error)
  }
}

const invoiceController = {
  create,
  findAll,
  findOne,
  updateOne,
  deleteOne,
  getSummary,
  getTotalsByMonth
}

export default invoiceController
